'use strict';

app.factory('Training', function ($firebase, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  var trainings = $firebase(ref.child('trainings')).$asArray();

  var Training = {
    all: trainings,
    create: function (training) {
      return trainings.$add(training).then(function(trainingRef) {
        $firebase(ref.child('user_trainings').child(training.creatorUID))
                        .$push(trainingRef.name());
        return trainingRef;
      });
    },
    get: function (trainingId) {
      return $firebase(ref.child('trainings').child(trainingId)).$asObject();
    },
    steps: function (trainingId) {
      return $firebase(ref.child('steps').child(trainingId)).$asArray();
    },
    delete: function (training) {
      return trainings.$remove(training);
    }
  };

  return Training;
});


