var InCloudTrnAppUrl = "https://hakunamatata.firebaseio.com";
var InCloudTrnID = "-JhvnHWyPDTJJCMGLjV5";
var trainingStepsUrl = InCloudTrnAppUrl + "/steps/" + InCloudTrnID + "/.json";
var ref = new Firebase("https://hakunamatata.firebaseio.com");

function clearCurrentStep(authData) {
    var currentStep = ref.child("currentSteps").child(authData.uid);
    currentStep.remove();
}

function startIntro() {
    resumeIntro(true);
}

function resumeIntro(clearData) {
    var authData = ref.getAuth();
    if (authData) {
        //sweet! we can use the existing id
        console.log("Authenticated successfully:", authData);
        if (clearData)
            clearCurrentStep(authData);
        getJsonAndProcess(authData);

    } else {
        ref.authAnonymously(function (error, authData) {
            if (error) {
                console.log("Login Failed!", error);

            } else {
                console.log("Authenticated successfully:", authData);
                if (clearData)
                    clearCurrentStep(authData);
                getJsonAndProcess(authData);
            }
        }, {
            //forget the id when browser is closed
            remember: "sessionOnly"
        });
    }
}

function getJsonAndProcess(authData) {
    $.getJSON(trainingStepsUrl, function (data) {
        var training = {
            steps: []
        };

        var intro = introJs();
        var foundCurrentPage = false;
        var onCompleteIsSet = false;
        var foundStepKey = false;

        //try to retrieve the current step
        var currentStep = ref.child("currentSteps").child(authData.uid);
        var currentStepKey = null;
        currentStep.once("value", function (currentStepForUser) {
            if (currentStepForUser.val()) {
                currentStepKey = currentStepForUser.val().currentStep;
                console.log("starting at " + currentStepKey);

                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (!foundStepKey && key != currentStepKey)
                            continue;
                        else {
                            //if (window.location.pathname.indexOf(data[key].page) > -1)
                            foundStepKey = true;
                            //else
                            //    return;
                        }

                        //check if the step is for this page
                        if (window.location.pathname.indexOf(data[key].page) > -1) {
                            var stepData = {};
                            stepData["intro"] = data[key].content;
                            stepData["element"] = data[key].element;
                            training.steps.push(stepData);
                            foundCurrentPage = true;

                            //set a callback for when the whole training is done.
                            intro.oncomplete(function () {
                                clearCurrentStep(authData);
                            });

                        } else if (foundCurrentPage && !onCompleteIsSet) {
                            intro.setOption('doneLabel', 'Next page');

                            //set a callback for when the steps are completed on this page
                            intro.oncomplete(function () {
                                //set the current step to start from on the next page
                                currentStep.set({
                                    currentStep: key
                                })

                                //head over to the next page!
                                window.location.href = data[key].page;
                            });
                            onCompleteIsSet = true;
                            break;
                        }
                    }
                }
            } else {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        //check if the step is for this page
                        if (window.location.pathname.indexOf(data[key].page) > -1) {
                            var stepData = {};
                            stepData["intro"] = data[key].content;
                            stepData["element"] = data[key].element;
                            training.steps.push(stepData);
                            foundCurrentPage = true;

                            //set a callback for when the whole training is done.
                            intro.oncomplete(function () {
                                clearCurrentStep(authData);
                            });

                        } else if (foundCurrentPage && !onCompleteIsSet) {
                            intro.setOption('doneLabel', 'Next page');

                            //set a callback for when the steps are completed on this page
                            intro.oncomplete(function () {
                                //set the current step to start from on the next page
                                currentStep.set({
                                    currentStep: key
                                })

                                //head over to the next page!
                                window.location.href = data[key].page;
                            });
                            onCompleteIsSet = true;
                            break;
                        }
                    }
                }
            }

            //TODO: use to record user steps completed for saving progress/analytics
            //intro.onchange(function (target) {
            //    console.info("step");
            //});
            intro.setOptions(training);
            intro.start();
        });

    }).fail(function () {
        console.log("error");
    });
}