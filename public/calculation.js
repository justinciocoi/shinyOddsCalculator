let shinyDenominator = 4096

let teraShinyDenominator = 4190

const masudaBox = document.getElementById('masuda')
const charmBox = document.getElementById('charm')
const outbreakBox = document.getElementById('outbreak')

let masudaMethod = masudaBox.checked;
let shinyCharm = charmBox.checked;
let massOutbreak = outbreakBox.checked;

const encounterInput = document.getElementById('encounterType')

const powerInput = document.getElementById('power')
let powerLevel = parseInt(powerInput.value) || 0

const outbreakInput = document.getElementById('massOutbreak')
let outbreakLevel = outbreakInput.value

window.onload = function() {
    masudaBox.checked = false
    charmBox.checked = false
    outbreakBox.checked = false
    encounterInput.value = 'Encounters (No encounter power)'
    powerInput.value = 'none'
    calculateShinyOdds()
}

encounterInput.addEventListener('change', function() {
    calculateShinyOdds()
})

powerInput.addEventListener('change', function() {
    powerLevel = parseInt(powerInput.value) || 0
    console.log("Power Level is: ", parseInt(powerInput.value))
    calculateShinyOdds()
})

masudaBox.addEventListener('change', function() {
    masudaMethod = masudaBox.checked
    console.log("Masuda Method is now: ", masudaMethod)
    calculateShinyOdds()
})

charmBox.addEventListener('change', function() {
    shinyCharm = charmBox.checked
    console.log("Shiny Charm is now: ", shinyCharm)
    calculateShinyOdds()
})

outbreakBox.addEventListener('change', function() {
    massOutbreak = outbreakBox.checked
    calculateShinyOdds()
})

outbreakInput.addEventListener('change', function() {
    outbreakLevel = outbreakInput.value
    calculateShinyOdds()
})



let shinyOdds

function calculateShinyOdds() {
    console.log(powerLevel, masudaMethod)
    let baseRolls = 1
    let rollNumber = baseRolls

    if(masudaMethod) {
        rollNumber += 5
    }
    if(shinyCharm) {
        rollNumber += 2
    }
    if(powerLevel != 0 && !masudaMethod) {
        rollNumber += powerLevel
        //add a notif to user
    }
    if(powerLevel != 0 && masudaMethod) {
        document.getElementById('notification').innerText = "Sparkling Power does not affect egg hatching. Deselect masuda method to include sparkling power in calculation."
    }
    else {
        document.getElementById('notification').innerText = ""
    }

    if(!massOutbreak) {
        document.getElementById('massOutbreakOptions').style.display = 'none'
    }
    else if(massOutbreak && !masudaMethod) {
        document.getElementById('massOutbreakOptions').style.display = ''
        if(outbreakLevel == "30-59") {
            rollNumber += 1
        }
        if(outbreakLevel == ">60") {
            rollNumber += 2
        }
    }
    else if(massOutbreak && masudaMethod) {
        document.getElementById('notification').innerText = "Mass outbreaks don't apply to egg hatching. Deselect masuda method to include mass outbreak in calculation."
        document.getElementById('massOutbreakOptions').style.display = 'none'
    }

    shinyOdds = rollNumber/shinyDenominator
    console.log(rollNumber, "/", shinyDenominator, "=", shinyOdds)

    shinyOdds *= 100;

    let displayOdds = shinyOdds.toFixed(3)
    document.getElementById('odds').innerText = displayOdds
    calculateEncounterOdds()
    calculateExpectedTime()
    return shinyOdds
}

function calculateEncounterOdds() {
    let expectedEncounters = 1 / (shinyOdds / 100)
    expectedEncounters = Math.round(expectedEncounters)

    document.getElementById('encounters').innerText = expectedEncounters

    return expectedEncounters
}

function calculateExpectedTime() {
    let encounters = calculateEncounterOdds()

    let totalTime

    let encounterTime

    let encounterType = document.getElementById('encounterType').value

    if (masudaMethod) {
        document.getElementById('encounterType').value = 'Egg Hatching'
    }

    if(encounterType == 'Egg Hatching') {
        encounterTime = 60;
    }
    else if(encounterType == 'Encounters (No encounter power)') {
        encounterTime = 20;
    }
    else if(encounterType == 'Encounters (Encounter power lv 1)') {
        encounterTime = 15;
    }
    else if(encounterType == 'Encounters (Encounter power lv 2)') {
        encounterTime = 10;
    }
    else if(encounterType == 'Encounters (Encounter power lv 3)') {
        encounterTime = 5;
    }

    totalTime = (encounters * encounterTime) / 60

    let hours = Math.floor(totalTime / 60);
    let minutes =  totalTime % 60
    minutes = Math.floor(minutes)
    document.getElementById('expectedTime').innerText = `${hours} hour(s) and ${minutes} minute(s)`
}

/*

so, how do i want to do this?

the user should have the following inputs:
    masuda hunt? (boolean) (5 extra rolls)
        id = masuda
    shiny charm? (boolean)
        id = charm
    sparkling power? lv 1? 2? 3? (int dropdown)
        id = power


so, lets just read all those inputs, set them to variables, and calculate shiny odds when any of them are altered 
*/
