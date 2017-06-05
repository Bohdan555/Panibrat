var module = angular.module('portfolio',['Mydropzone','slick','ngAnimate','ui.bootstrap','ui.bootstrap.tpls','ngRoute']);
module.config(['$routeProvider',function($routeProvider){
  $routeProvider.when('/home',{
    templateUrl : 'views/home.html'
  }).when('/deals',{
    templateUrl : 'views/deals.html'
  });
}]);
// module.controller('listOfporf',['$scope',function($scope){
//  $scope.images = [{url:'pictures/img/img/s-l500 (1).jpg',descr:'lalalala'},{url:'pictures/img/img/s-l500 (1).jpg',descr:'lalalala'},{url:'pictures/img/img/s-l500 (1).jpg',descr:'lalalala'},
// {url:'pictures/img/img/s-l500 (1).jpg',descr:'lalalala'},{url:'pictures/img/img/s-l500 (1).jpg',descr:'lalalala'},{url:'pictures/img/img/s-l500 (1).jpg',descr:'lalalala'}]}]);
module.controller('offersList',['$scope','$uibModal','$http',function($scope,$uibModal,$http){
  $scope.currentPage = 1;
  $scope.pageSize = 3;
  $http({
      method : 'get',
      url: 'http://ceafc034.ngrok.io/testgetoffer',
  }).then(function(data){$scope.offers = data.data;});
  $scope.resetSlick = true;
  $scope.open = function(size)
    {
      $scope.resetSlick = false;
      var modalInstance = $uibModal.open({
      template: '<div class="container"'+
      '<div class="row">'+
        '<div class="col-md-7 col-md-offset-1 addPortfolioHeader">'+
          '<h3> Додати Пропозицію</h3> '+
        '</div> '+
      '</div>'+
        '<div class="row">'+
          '<div class="col-md-3 col-md-offset-1 divForImage">'+
            '<div drop-zone ng-model="data.upload" class="one">'+
              '<p>Drop files here <span>(or click to upload)</span></p>'+
            '</div>'+
            '<div class="portfImage">'+
              '<img ng-repeat="file in data.upload" src="{{file.data}}" />'+
            '</div>'+
          '</div>'+
          '<div class="col-md-5  imageInfo">'+
              '<div> <span>Натисніть на кватрат, щоб додати фотографію своєї роботи у форматі .jpg або .png</span> </div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
        '<div class="form-group form-group-sm col-md-8 col-md-offset-1 headerOfOffer">'+
          '<label class="col-md-2 control-label" for="formGroupInputSmall">Назва пропозиції</label>'+
            '<div class="col-md-5">'+
              '<input class="form-control" type="text" ng-model="headerOfOffer" id="formGroupInputSmall" placeholder="Назва">'+
            '</div>'+
         '</div>'+
        '<div class="form-group col-md-5 col-md-offset-1 TypeOfOffer">'+
          '<label for="exampleSelect1">Тип послгуи</label>'+
          '<select class="form-control" id="exampleSelect1" ng-model="typeOfOffer">'+
            '<option>Товар</option>'+
            '<option>Послуга</option>'+
          '</select>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
      '<div class="col-md-8 col-md-offset-1 imageDescr">'+
        '<h3>Опис роботи (до 15 слів)</h3>'+
        '<textarea ng-model="descrOfNewOffer" name="name" rows="8" cols="65"> </textarea>'+
      '</div>'+
      '<div class="row">'+
          '<div class="col-md-7 col-md-offset-1 addPortfolioButtons">'+
            '<ul class="list-inline">'+
              '<li> <button ng-click="closeMod()" class="btn"><span>Скасувати</span></button> </li>'+
              '<li class="pull-right"> <button ng-click="savePortf()" class="btn"><span>Зберегти</span></button> </li>'+
            '</ul>'+
          '</div>'+
      '</div>'+
      '</div> </div>',
      controller: 'CreateOfferModule',
      size: size,
      resolve: {
        images: function () {
          return $scope.offers;
        }
      }
    });
    modalInstance.result.then(function (images) {
      $scope.offers = images;
      $scope.resetSlick = true;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
}]);
module.filter('startFrom',function(){
  return function(data,start){
    return data.slice(start);
  }
});
module.controller('CreateOfferModule',['$scope','$uibModalInstance','images','$http',function($scope,$uibModalInstance,images,$http){
    $scope.data = {upload :[]};
    $scope.images = images;
    $scope.closeMod = function(){
      $uibModalInstance.close($scope.images);
    }
    $scope.savePortf = function(){
      var offerData = {image :$scope.data.upload[0].data,header:$scope.headerOfOffer,offer_type:$scope.typeOfOffer,description:$scope.descrOfNewOffer};
      console.log(offerData);
      $http({
        method : 'post',
        url: 'http://ceafc034.ngrok.io/testoffer',
        contentType : 'json',
        data : angular.toJson(offerData)
      });
      $uibModalInstance.close($scope.images);
    }
}]);
module.controller('CreatePortfModule',['$scope','$uibModalInstance','images','$http',function($scope,$uibModalInstance,images,$http){
    $scope.data = {upload :[]};
    $scope.images = images;
    $scope.closeMod = function(){
      $uibModalInstance.close($scope.images);
    }
    $scope.savePortf = function(){
      $scope.images.push({url:$scope.data.upload[0].data,description:$scope.descrOfNewPortfolio});
      var PortfolioImage = {image : $scope.data.upload[0].data,description : $scope.descrOfNewPortfolio};
      $http({
        method : 'post',
        url : 'http://ceafc034.ngrok.io/saveportfolio',
        contentType : 'json',
        data : PortfolioImage
      });
      $uibModalInstance.close($scope.images);
    }
}]);
module.controller('createOrChangePorf',['$scope','$uibModal','$log','$http',function($scope,$uibModal,$log,$http){
  //$scope.resetSlick = true;
  $http({
    method : 'get',
    url: 'http://ceafc034.ngrok.io/loadportfolio',
  }).then(function(data){$scope.images = data.data;$scope.resetSlick = true;});
  $scope.open = function(size)
    {
      $scope.resetSlick = false;
      var modalInstance = $uibModal.open({
      template: '<div class="container"'+
      '<div class="row">'+
        '<div class="col-md-7 col-md-offset-1 addPortfolioHeader">'+
          '<h3> Додати Портфоліо </h3> '+
        '</div> '+
      '</div>'+
        '<div class="row">'+
          '<div class="col-md-3 col-md-offset-1 divForImage">'+
            '<div drop-zone ng-model="data.upload" class="one">'+
              '<p>Drop files here <span>(or click to upload)</span></p>'+
            '</div>'+
            '<div class="portfImage">'+
              '<img ng-repeat="file in data.upload" src="{{file.data}}" />'+
            '</div>'+
          '</div>'+
          '<div class="col-md-5  imageInfo">'+
              '<div> <span>Натисніть на кватрат, щоб додати фотографію своєї роботи у форматі .jpg або .png</span> </div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
      '<div class="col-md-8 col-md-offset-1 imageDescr">'+
        '<h3>Опис роботи (до 15 слів)</h3>'+
        '<textarea ng-model="descrOfNewPortfolio" name="name" rows="8" cols="65"> </textarea>'+
      '</div>'+
      '<div class="row">'+
          '<div class="col-md-7 col-md-offset-1 addPortfolioButtons">'+
            '<ul class="list-inline">'+
              '<li> <button ng-click="closeMod()" class="btn"><span>Скасувати</span></button> </li>'+
              '<li class="pull-right"> <button ng-click="savePortf()" class="btn"><span>Зберегти</span></button> </li>'+
            '</ul>'+
          '</div>'+
      '</div>'+
      '</div> </div>',
      controller: 'CreatePortfModule',
      size: size,
      resolve: {
        images: function () {
          return $scope.images;
        }
      }
    });
    modalInstance.result.then(function (images) {
      $scope.images = images;
      $scope.resetSlick = true;
      console.log($scope.images);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
  $scope.edit = function(size)
  {
    $scope.resetSlick = false;
    var modalInstance = $uibModal.open({
      template:'<div class="container"'+
      '<div class="row">'+
        '<div class="col-md-7 col-md-offset-1 addPortfolioHeader">'+
          '<h3> Додати Портфоліо </h3> '+
        '</div> '+
      '</div>'+
        '<div class="row">'+
          '<div class="col-md-3 col-md-offset-1 divForImage">'+
            '<div drop-zone ng-model="data.upload" class="one">'+
              '<p>Drop files here <span>(or click to upload)</span></p>'+
            '</div>'+
            '<div class="portfImage">'+
              '<img ng-repeat="file in data.upload" src="{{file.data}}" />'+
            '</div>'+
          '</div>'+
          '<div class="col-md-5  imageInfo">'+
              '<div> <span>Натисніть на кватрат, щоб додати фотографію своєї роботи у форматі .jpg або .png</span> </div>'+
          '</div>'+
        '</div>'+
      '</div>'+
      '<div class="row">'+
      '<div class="col-md-8 col-md-offset-1 imageDescr">'+
        '<h3>Опис роботи (до 15 слів)</h3>'+
        '<textarea ng-model="descrOfNewPortfolio" name="name" rows="8" cols="65"> </textarea>'+
      '</div>'+
      '<div class="row">'+
          '<div class="col-md-7 col-md-offset-1 addPortfolioButtons">'+
            '<ul class="list-inline">'+
              '<li> <button ng-click="closeMod()" class="btn"><span>Скасувати</span></button> </li>'+
              '<li class="pull-right"> <button ng-click="savePortf()" class="btn"><span>Зберегти</span></button> </li>'+
            '</ul>'+
          '</div>'+
      '</div>'+
      '</div> </div>',
      size: size,
      resolve: {
        images: function () {
          return '';
        }
      }
    });
    modalInstance.result.then(function () {
      // $scope.images = images;
      // $scope.resetSlick = true;
      console.log($scope.images);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }
}]);
