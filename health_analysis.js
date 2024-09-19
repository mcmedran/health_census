// The button used to add patient data
const addPatientButton = document.getElementById("addPatient");
// the HTML element where you will see analysis reports displayed
const report = document.getElementById("report");
// the variable name of the button which displays the 
// search results when clicked
const btnSearch = document.getElementById('btnSearch');
// an empty array to store the collected patient data
const patients = [];

/**
 * Adds the patients details
 * @return 
 */
function addPatient() {
    // Retrieves the patients details in the form 
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    // Verify that appropriate fields are entered correctly
    if (name && gender && age && condition) {
      patients.push({ name, gender: gender.value, age, condition });
      // clear the input fields for the next entry
      resetForm();
      // update and display the analysis report based on the
      // newly added patient data
      generateReport();
    }
  }

/**
 * Clears the values of the name, gender, age, and condition
 * fields in the HTML form by setting them to empty strings or
 * unchecked for radoi buttons, effectively resetting the form
 * to its initial state.
 */
function resetForm() {
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
  }
  /**
   * Calculates and constucts an analysis report based on the
   * collected patient data stored in the patients array
   */
  function generateReport() {
    const numPatients = patients.length;

    // data structure(object) initializing counters for 
    // specific medical conditions
    const conditionsCount = {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    };
    
    // Nested object with gender-specific condition counters for
    // each medical condition, also initilaized to zero for each
    // condition
    const genderConditionsCount = {
      Male: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
      },
      Female: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
      },
    };

    // iterates through patient array
    for (const patient of patients) {
      conditionsCount[patient.condition]++;
      genderConditionsCount[patient.gender][patient.condition]++;
    }

    report.innerHTML = `Number of patients: ${numPatients}<br><br>`;
    report.innerHTML += `Conditions Breakdown:<br>`;
    for (const condition in conditionsCount) {
      report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    report.innerHTML += `<br>Gender-Based Conditions:<br>`;
    for (const gender in genderConditionsCount) {
      report.innerHTML += `${gender}:<br>`;
      for (const condition in genderConditionsCount[gender]) {
        report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
      }
    }
  }

addPatientButton.addEventListener("click", addPatient);

/**
 * Used to retrieve health condition information based on user input
 */
function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('./health_analysis.json')
      .then(response => response.json())
      .then(data => {
        const condition = data.conditions.find(item => item.name.toLowerCase() === input);

        if (condition) {
          const symptoms = condition.symptoms.join(', ');
          const prevention = condition.prevention.join(', ');
          const treatment = condition.treatment;

          resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
          resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

          resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
          resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
          resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
        } else {
          resultDiv.innerHTML = 'Condition not found.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
      });
  }
btnSearch.addEventListener('click', searchCondition);