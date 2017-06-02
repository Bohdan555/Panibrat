var module = angular.module('portfolio',['slick','ngAnimate','ui.bootstrap','ui.bootstrap.tpls']);
module.controller('listOfporf',['$scope',function($scope){
 $scope.images = ['pictures/portImg.jpg','pictures/D100.jpg','pictures/portImg.jpg','pictures/portImg.jpg','pictures/portImg.jpg','pictures/portImg.jpg','pictures/portImg.jpg','pictures/portImg.jpg','pictures/portImg.jpg','pictures/portImg.jpg','pictures/portImg.jpg','pictures/portImg.jpg'];
}]);
module.controller('offersList',['$scope',function($scope){
  $scope.currentPage = 1;
  $scope.pageSize = 3;
  $scope.offers = ['pictures/img/img/s-l500 (1).jpg','pictures/img/img/s-l500 (2).jpg','pictures/img/img/s-l500 (3).jpg'
  ,'pictures/img/img/s-l500 (4).jpg','pictures/img/img/s-l500 (5).jpg',
  'pictures/img/img/s-l500 (6).jpg','pictures/img/img/s-l500 (7).jpg'];
}]);
module.filter('startFrom',function(){
  return function(data,start){
    return data.slice(start);
  }
});
module.controller('createPorf',['$scope','$uibModal','$log',function($scope,$uibModal,$log){
    $scope.open = function(size)
    {
      var modalInstance = $uibModal.open({
      template: '<div class="container"> <div class="row"> <div class="col-md-7 col-md-offset-1 addPortfolioHeader"> <h3> Додати Портфоліо </h3> </div> </div> <div class="row"> <div class="col-md-3 col-md-offset-1 imagePlace" ><div></div> </div> <div class="col-md-4  imageInfo"> <div> <span>Натисніть на кватрат, щоб додати фотографію своєї роботи у форматі .jpg або .png</span> </div> </div> </div> <div class="row"> <div class="col-md-8 col-md-offset-1 imageDescr"> <h3>Опис роботи (до 15 слів)</h3> <textarea ng-model="descrOfNewPortfolio" name="name" rows="8" cols="75"> </textarea> </div> </div> <div class="row"> <div class="col-md-6 col-md-offset-1 addPortfolioButtons"> <ul class="list-inline" ng-contorller="createPorf"> <li> <button ng-click="closeMod()" class="btn"><span>Скасувати</span></button> </li> <li class="pull-right"> <button ng-click="savePortf()" class="btn"><span>Зберегти</span></button> </li> </ul> </div> </div> </div> </div>',
      controller: function($uibModalInstance,$scope){
        $scope.closeMod = function(){
          $uibModalInstance.close();
        },
        $scope.savePortf = function(){
          
        }
      },
      size: size,
      resolve: {
        items: function () {
          return 'hello';
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
}]);
module.controller('innerRatings',['$scope','$uibModal','$uibModalInstance','$log','$http',function($scope,$uibModal,$uibModalInstance,$log,$http) {
    var newrat ={};
    $scope.closeMod = function(){
        $uibModalInstance.close();
    },
        $scope.savePortf = function(){

        },
        $scope.getResponse = function(){
            if( $scope.stars !== undefined) {
                newrat = {
                    "sender":"Sender",
                    "receiver":"Receiver",
                    "waretask":"any",
                    "stars":"",
                    "resp":"",
                    "date":""
                };
                newrat.stars = $scope.stars;
                newrat.resp = $scope.resp;
                newrat.date = new Date();
                $http({
                    method: 'post',
                    url: '/Barter/data/ratings_di_caprio.json',
                    data: newrat
                }).then(function (response) {
                    console.log("Updated ratings data.");
                },function (error){
                    console.log(error, " can't update ratings data.");
                });
                newrat.yellows="";
                newrat.grays="";
                for (j = 0; j < newrat.stars; j++) {
                    newrat.yellows += '★';
                }
                for (j = 0; j < 5 - newrat.stars; j++) {
                    newrat.grays += '★';
                }
                newrat.sender = 'Anonymous';
                newrat.receiver = 'Ді Капріо';
                newrat.date = new Date();
                $uibModalInstance.close(newrat);
            }
            else{
                alert("Необхідно дати оцінку перед збереженням відгуку.");
            }
        }
}]);
module.controller('ratings',['$scope','$uibModal','$log','$http',function($scope,$uibModal,$log,$http){
    $scope.open = function(size)
    {
        var modalInstance = $uibModal.open({
            template: '<form id="ratings" action="" method="post" class="ratings-edit"><div id="reviewStars-input"><input id="star-4" type="radio" name="reviewStars" ng-model="stars" ng-value="5" required/><label title="відмінно" for="star-4"></label><input id="star-3" type="radio" name="reviewStars" ng-model="stars" ng-value="4"/><label title="добре" for="star-3"></label><input id="star-2" type="radio" name="reviewStars" ng-model="stars" ng-value="3"/>        <label title="непогано" for="star-2"></label>        <input id="star-1" type="radio" name="reviewStars" ng-model="stars" ng-value="2"/>        <label title="поганенько" for="star-1"></label>        <input id="star-0" type="radio" name="reviewStars" ng-model="stars" ng-value="1"/>        <label title="жахливо" for="star-0"></label></div><div class="form-group"><br /><br /><br /><label id="review">&nbsp;Відклик:</label><br /><br /><textarea ng-model="resp" rows="10" cols="34" maxlength="190"></textarea><button class="button" type="button" id="button-yes" ng-click="getResponse()">Зберегти</button></div></form>',
            controller:"innerRatings",
            size: size,
            resolve: {
                items: function () {
                    return 'hello';
                }
            }
        });
        modalInstance.result.then(function (newrat) {
            $scope.object.push(newrat);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    $http({
        method: 'get',
        url: '/Barter/data/ratings_di_caprio.json'
    }).then(function (response) {
        $scope.object = [];
        for (i = 0; i < response.data.length; i++) {
            $scope.object.push(response.data[i]);
        }
        console.log("Got ratings data.");
        for (i = 0; i < $scope.object.length; i++) {
            $scope.object[i].yellows = '';
            $scope.object[i].grays = '';
            for (j = 0; j < $scope.object[i].stars; j++) {
                $scope.object[i].yellows += '★';
            }
            for (j = 0; j < 5 - $scope.object[i].stars; j++) {
                $scope.object[i].grays += '★';
            }
        }
    }, function (error) {
        console.log(error, " can't get ratings data.");
    });
}]);
module.controller('innerIndividual',['$scope','$uibModalInstance','$log','$http','user_individual',function($scope,$uibModalInstance,$log,$http,user_individual) {
    //alert(user_individual.user_phone_number);
    $scope.getResponse = function() {
        //alert(user_individual.user_phone_number);
        alert($scope.individual_surname);
        if( user_individual.user_phone_number.length === 13) {

            $uibModalInstance.close(user_individual);
        }
        else{
            alert("Правильно заповніть необхідні поля.");
        }
    }

}]);
module.controller('individual',['$scope','$uibModal','$log','$http',function($scope,$uibModal,$log,$http){
    $scope.open = function(size,individual)
    {
        var modalInstance = $uibModal.open({
            templateUrl: '/Barter/individual.html',
            controller: 'innerIndividual',
            size: size,
            //scope: true,
            resolve: {
                user_individual: function () {
                    //alert(individual.ID_user);
                    return individual;
                }
            }
        });
        modalInstance.result.then(function (alteredItem) {
            $scope.user_individual = alteredItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }
    $http({
        method: 'get',
        url: '/Barter/data/individual.json'
    }).then(function (response) {
        $scope.user_individual = {
            "ID_user": "",
            "individual_surname": "",
            "individual_first_name": "",
            "individual_middle_name": "",
            "ID_individual_profession": "",
            "individual_birth_date": "",
            "ID_individual_sex": "",
            "ID_individual_education_place": "",
            "ID_individual_graduation_year": "",
            "user_phone_number": ""
        }
        $scope.user_individual = response.data;
        $scope.user_individual.individual_birth_date = new Date($scope.user_individual.individual_birth_date);
        console.log("Got user_individual data.");
        //console.log($scope.user_individual.individual_surname);
    }, function (error) {
        console.log(error, " can't get user_individual data.");
    });


}]);
