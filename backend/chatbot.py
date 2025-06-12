import re
import pandas as pd
from sklearn import preprocessing
from sklearn.tree import DecisionTreeClassifier, _tree
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.svm import SVC
from sklearn.feature_extraction.text import TfidfVectorizer
import csv
import streamlit as st
import warnings
import datetime
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson.objectid import ObjectId

warnings.filterwarnings("ignore", category=DeprecationWarning)

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost/ehr_system")

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client["ehr_system"]
doctors_collection = db["doctors"]
users_collection = db["users"]
appointments_collection = db["appointments"]

# Create directories if they don't exist
data_dir = "Data"
master_data_dir = "MasterData"
os.makedirs(data_dir, exist_ok=True)
os.makedirs(master_data_dir, exist_ok=True)

# Load data
training = pd.read_csv('Data/Training.csv')
testing = pd.read_csv('Data/Testing.csv')
cols = training.columns[:-1]
x = training[cols]
y = training['prognosis']

reduced_data = training.groupby(training['prognosis']).max()

# Prepare TF-IDF transformation
def symptoms_to_text(row):
    return ' '.join([col for col in cols if row[col] == 1])

# Apply TF-IDF to training and testing data
x_text = x.apply(symptoms_to_text, axis=1)
testx_text = testing[cols].apply(symptoms_to_text, axis=1)

# Initialize TF-IDF vectorizer
tfidf = TfidfVectorizer()
x_tfidf = tfidf.fit_transform(x_text)
testx_tfidf = tfidf.transform(testx_text)

# Encode labels
le = preprocessing.LabelEncoder()
le.fit(y)
y = le.transform(y)
testy = le.transform(testing['prognosis'])

# Split data
x_train, x_test, y_train, y_test = train_test_split(x_tfidf, y, test_size=0.33, random_state=42)

# Train Decision Tree (for symptom suggestion)
clf = DecisionTreeClassifier()
clf.fit(x_train, y_train)
# Uncomment cross-validation now that we have a larger dataset
scores = cross_val_score(clf, x_test, y_test, cv=3)

# Train SVM on TF-IDF data
model = SVC(probability=True)
model.fit(x_train, y_train)

# Dictionaries for symptoms, severity, descriptions, and precautions
severityDictionary = {}
description_list = {}
precautionDictionary = {}
symptoms_dict = {symptom: index for index, symptom in enumerate(cols)}

# Fetch doctors from MongoDB
def get_doctors():
    try:
        doctors_data = list(doctors_collection.find({}, {"_id": 0}))
        doctors = {doctor["name"]: {
            "specialization": doctor["specialization"],
            "slots": doctor["slots"]
        } for doctor in doctors_data}
        return doctors
    except Exception as e:
        st.error(f"Error fetching doctors: {e}")
        return {}

def getSeverityDict():
    try:
        with open('MasterData/symptom_severity.csv') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            # Skip the header row
            header = next(csv_reader, None)
            if not header or len(header) < 2:
                st.error("symptom_severity.csv is missing a valid header (expected 'Symptom,Severity')")
                return
            for row in csv_reader:
                # Only process rows that have content (skip empty rows)
                if len(row) > 1:
                    try:
                        severityDictionary[row[0]] = int(row[1])
                    except ValueError as e:
                        st.warning(f"Cannot convert severity '{row[1]}' to integer for symptom '{row[0]}'")
                # We're explicitly not showing warnings for empty rows now
    except Exception as e:
        st.error(f"Error reading symptom_severity.csv: {e}")

def getDescription():
    try:
        with open('MasterData/symptom_Description.csv') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            # Skip the header row
            header = next(csv_reader, None)
            if not header or len(header) < 2:
                st.error("symptom_Description.csv is missing a valid header (expected 'Disease,Description')")
                return
            for row in csv_reader:
                if len(row) > 1:
                    description_list[row[0]] = row[1]
                # Skip empty rows silently
    except Exception as e:
        st.error(f"Error reading symptom_Description.csv: {e}")

def getprecautionDict():
    try:
        with open('MasterData/symptom_precaution.csv') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            # Skip the header row
            header = next(csv_reader, None)
            if not header or len(header) < 5:
                st.error("symptom_precaution.csv is missing a valid header (expected 'Disease,Precaution_1,Precaution_2,Precaution_3,Precaution_4')")
                return
            for row in csv_reader:
                if len(row) >= 5:
                    precautionDictionary[row[0]] = [row[1], row[2], row[3], row[4]]
                # Skip invalid rows silently
    except Exception as e:
        st.error(f"Error reading symptom_precaution.csv: {e}")

def calc_condition(exp, days):
    if not exp:
        return "No additional symptoms provided. Please consult a doctor if symptoms persist."
    sum_severity = 0
    for item in exp:
        if item in severityDictionary:
            sum_severity += severityDictionary[item]
        else:
            st.warning(f"Severity for symptom '{item}' not found. Skipping this symptom.")
    if (sum_severity * days) / (len(exp) + 1) > 13:
        return "You should take the consultation from doctor."
    return "It might not be that bad but you should take precautions."

def check_pattern(dis_list, inp):
    pred_list = []
    inp = inp.replace(' ', '_')
    patt = f"{inp}"
    regexp = re.compile(patt)
    pred_list = [item for item in dis_list if regexp.search(item)]
    if len(pred_list) > 0:
        return 1, pred_list
    return 0, []

def sec_predict(symptoms_exp):
    input_text = ' '.join(symptoms_exp)
    input_tfidf = tfidf.transform([input_text])
    return le.inverse_transform(model.predict(input_tfidf))

def print_disease(node):
    node = node[0]
    val = node.nonzero()
    disease = le.inverse_transform(val[0])
    return list(map(lambda x: x.strip(), list(disease)))

# Function to handle appointment confirmation
def confirm_appointment(selected_doctor, selected_date, selected_slot):
    try:
        # Extract the doctor's first name (e.g., "John" from "Dr. John Doe")
        doctor_first_name = selected_doctor.split()[1]
        # Fetch doctorId from users collection
        doctor_record = users_collection.find_one({"firstName": doctor_first_name, "role": "doctor"})
        if not doctor_record:
            # Log more details for debugging
            st.error(f"Doctor with firstName '{doctor_first_name}' and role 'doctor' not found in the users collection.")
            # List available doctors in users collection for debugging
            available_doctors = list(users_collection.find({"role": "doctor"}, {"firstName": 1, "lastName": 1, "_id": 0}))
            if available_doctors:
                st.info(f"Available doctors in users collection: {available_doctors}")
            else:
                st.info("No doctors found in users collection.")
            return False

        doctor_id = str(doctor_record["_id"])

        # Create appointment record
        appointment = {
            "_id": str(ObjectId()),
            "patientId": None,  # No patientId since chatbot doesn't create patients
            "patient": st.session_state.name,
            "doctorId": doctor_id,
            "doctor": selected_doctor,
            "time": selected_slot,
            "date": selected_date,
            "room": "Room TBD",
            "visitType": "Chatbot Referral"
        }

        # Insert appointment into appointments collection
        appointments_collection.insert_one(appointment)

        # Remove the booked slot from doctors collection
        doctors_collection.update_one(
            {"name": selected_doctor},
            {"$pull": {f"slots.{selected_date}": selected_slot}}
        )

        return True
    except Exception as e:
        st.error(f"Error confirming appointment: {e}")
        return False

# Streamlit app
st.title("SwasthyaAI - JIIT")

# Initialize session state
if 'step' not in st.session_state:
    st.session_state.step = 0
    st.session_state.name = ""
    st.session_state.symptom = ""
    st.session_state.days = 0
    st.session_state.confirmed_symptom = ""
    st.session_state.symptoms_present = []
    st.session_state.symptoms_exp = []
    st.session_state.diagnosis = ""
    st.session_state.selected_doctor = ""
    st.session_state.selected_date = ""
    st.session_state.selected_slot = ""

# Load dictionaries
getSeverityDict()
getDescription()
getprecautionDict()

# Fetch doctors
doctors = get_doctors()

# Step 0: Get user name
if st.session_state.step == 0:
    st.markdown("### Welcome to the HealthCare ChatBot")
    name = st.text_input("Your Name?")
    if st.button("Submit Name"):
        if name:
            st.session_state.name = name
            st.session_state.step = 1
            st.rerun()

# Step 1: Get initial symptom
if st.session_state.step == 1:
    st.write(f"Hello, {st.session_state.name}")
    symptom_input = st.text_input("Enter the symptom you are experiencing:")
    if st.button("Submit Symptom"):
        chk_dis = cols
        conf, cnf_dis = check_pattern(chk_dis, symptom_input)
        if conf == 1:
            st.session_state.symptom = symptom_input
            st.session_state.cnf_dis = cnf_dis
            st.session_state.step = 2
            st.rerun()
        else:
            st.error("Enter a valid symptom.")

# Step 2: Confirm symptom
if st.session_state.step == 2:
    st.write("Searches related to your input:")
    for num, item in enumerate(st.session_state.cnf_dis):
        st.write(f"{num}) {item}")
    conf_inp = st.selectbox("Select the one you meant:", options=[f"{i}" for i in range(len(st.session_state.cnf_dis))])
    if st.button("Confirm Symptom"):
        st.session_state.confirmed_symptom = st.session_state.cnf_dis[int(conf_inp)]
        st.session_state.step = 3
        st.rerun()

# Step 3: Get number of days
if st.session_state.step == 3:
    days = st.number_input("For how many days have you been experiencing this symptom?", min_value=1, step=1)
    if st.button("Submit Days"):
        st.session_state.days = days
        st.session_state.step = 4
        st.rerun()

# Step 4: Process symptom and get additional symptoms
if st.session_state.step == 4:
    tree_ = clf.tree_
    tfidf_feature_names = tfidf.get_feature_names_out()
    feature_name = [tfidf_feature_names[i] if i != _tree.TREE_UNDEFINED else "undefined!" for i in tree_.feature]
    
    def recurse(node, depth):
        if tree_.feature[node] != _tree.TREE_UNDEFINED:
            name = feature_name[node]
            threshold = tree_.threshold[node]
            val = 1 if st.session_state.confirmed_symptom in cols and name == st.session_state.confirmed_symptom else 0
            if val <= threshold:
                return recurse(tree_.children_left[node], depth + 1)
            else:
                if name in cols:
                    st.session_state.symptoms_present.append(name)
                return recurse(tree_.children_right[node], depth + 1)
        else:
            present_disease = print_disease(tree_.value[node])
            red_cols = reduced_data.columns
            symptoms_given = red_cols[reduced_data.loc[present_disease].values[0].nonzero()]
            st.write("Are you experiencing any of the following symptoms?")
            for syms in list(symptoms_given):
                if syms in severityDictionary:
                    response = st.radio(f"{syms}?", options=["Yes", "No"], key=syms)
                    if response == "Yes":
                        st.session_state.symptoms_exp.append(syms)
            return present_disease

    present_disease = recurse(0, 1)
    if present_disease is None:
        st.error("Unable to determine a diagnosis. Please try again with different symptoms.")
        st.session_state.step = 5
    else:
        second_prediction = sec_predict(st.session_state.symptoms_exp)
        condition = calc_condition(st.session_state.symptoms_exp, st.session_state.days)
        
        if st.button("Get Diagnosis"):
            st.markdown("### Diagnosis")
            st.write(f"**Symptoms provided**: {', '.join(st.session_state.symptoms_exp) if st.session_state.symptoms_exp else 'None'}")
            st.write(condition)
            if present_disease[0] == second_prediction[0]:
                st.write(f"You may have *{present_disease[0]}*")
                try:
                    st.write(description_list[present_disease[0]])
                except KeyError:
                    st.warning(f"No description available for {present_disease[0]}.")
            else:
                st.write(f"You may have *{present_disease[0]}* or *{second_prediction[0]}*")
                try:
                    st.write(description_list[present_disease[0]])
                except KeyError:
                    st.warning(f"No description available for {present_disease[0]}.")
                try:
                    st.write(description_list[second_prediction[0]])
                except KeyError:
                    st.warning(f"No description available for {second_prediction[0]}.")

            # Display precautions immediately after diagnosis
            st.markdown("### Precautions to Take")
            try:
                precaution_list = precautionDictionary[present_disease[0]]
                for i, precaution in enumerate(precaution_list, 1):
                    st.write(f"{i}) {precaution}")
            except KeyError:
                st.warning(f"No precautions available for {present_disease[0]}.")

            # Display secondary precautions if the predictions differ
            if present_disease[0] != second_prediction[0]:
                st.markdown("### Precautions for Secondary Diagnosis")
                try:
                    precaution_list = precautionDictionary[second_prediction[0]]
                    for i, precaution in enumerate(precaution_list, 1):
                        st.write(f"{i}) {precaution}")
                except KeyError:
                    st.warning(f"No precautions available for {second_prediction[0]}.")
            
            st.session_state.diagnosis = present_disease[0]
            st.session_state.step = 5
            st.rerun()

# Step 5: Schedule Appointment
if st.session_state.step == 5:
    st.markdown("### Schedule an Appointment")
    st.write("Based on your diagnosis, let's schedule an appointment with a doctor.")
    
    # Select Doctor
    doctor_options = list(doctors.keys())
    if not doctor_options:
        st.error("No doctors available. Please contact the administrator.")
    else:
        selected_doctor = st.selectbox("Select a Doctor:", options=doctor_options)
        
        # Select Date
        available_dates = list(doctors[selected_doctor]["slots"].keys())
        selected_date = st.selectbox("Select a Date:", options=available_dates)
        
        # Select Time Slot
        available_slots = doctors[selected_doctor]["slots"][selected_date]
        if available_slots:
            selected_slot = st.selectbox("Select a Time Slot:", options=available_slots)
            if st.button("Confirm Appointment"):
                # Call the confirm_appointment function
                if confirm_appointment(selected_doctor, selected_date, selected_slot):
                    st.success(f"Appointment confirmed with {selected_doctor} on {selected_date} at {selected_slot}.")
                    st.session_state.selected_doctor = selected_doctor
                    st.session_state.selected_date = selected_date
                    st.session_state.selected_slot = selected_slot
                    st.session_state.step = 6
                    st.rerun()
        else:
            st.warning("No available slots for this date.")
            st.markdown("#### Suggestions")
            other_doctors = [doc for doc in doctors.keys() if doc != selected_doctor]
            other_dates = [date for date in doctors[selected_doctor]["slots"].keys() if date != selected_date]
            
            if other_doctors:
                st.write("Consider a different doctor:")
                other_doctor = st.selectbox("Alternative Doctor:", options=other_doctors, key="alt_doctor")
                if st.button("Switch Doctor"):
                    st.session_state.selected_doctor = other_doctor
                    st.rerun()
            
            if other_dates:
                st.write("Or select a different date:")
                other_date = st.selectbox("Alternative Date:", options=other_dates, key="alt_date")
                if st.button("Switch Date"):
                    st.session_state.selected_date = other_date
                    st.rerun()

# Step 6: Final Confirmation and Restart
if st.session_state.step == 6:
    st.markdown("### Appointment Summary")
    st.write(f"**Patient Name**: {st.session_state.name}")
    st.write(f"**Diagnosis**: {st.session_state.diagnosis}")
    st.write(f"**Doctor**: {st.session_state.selected_doctor}")
    st.write(f"**Date**: {st.session_state.selected_date}")
    st.write(f"**Time**: {st.session_state.selected_slot}")
    if st.button("Restart"):
        st.session_state.step = 0
        st.session_state.name = ""
        st.session_state.symptom = ""
        st.session_state.days = 0
        st.session_state.confirmed_symptom = ""
        st.session_state.symptoms_present = []
        st.session_state.symptoms_exp = []
        st.session_state.diagnosis = ""
        st.session_state.selected_doctor = ""
        st.session_state.selected_date = ""
        st.session_state.selected_slot = ""
        st.rerun()

st.markdown("---")
st.write("SwasthyaAI")
st.write("Made with ❤️ at JIIT")
st.write("under the supervision of Dr. Varun Srivastava")

# Explicitly close the MongoDB connection at the end
client.close()