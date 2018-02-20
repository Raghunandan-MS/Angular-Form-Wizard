var app = angular.module("formApp" , []);

app.directive('formPane' , function(){

	return{

		restrict: 'EA',
		transclude: true,
		controller: function($scope , $window)
		{
			var pages = $scope.pages = []; //A Page object will have : {num , selected , previous , next , confirm}

			$scope.selectPage = function(page)
			{

				angular.forEach(pages , function(page){

					page.selected = false;
					page.previous = false;
					page.confirm = false;
					page.next = false;

				});

				page.selected = true;

				$scope.showPage(page);

			}

			$scope.showPage = function(page)
			{
				if(page.num === "Page1")
				{
					page.previous = false;
					page.next = true;
				}
				else if(page.num === ("Page" + pages.length))
				{
					page.previous = true;
					page.confirm = true;
					page.next = false;
				}
				else
				{
					page.previous = true;
					page.next = true;
				}
			}

			this.showPrev = function(pageNum)
			{
				$scope.selectPage(pages[pageNum - 1]);
			}

			this.showNext = function(pageNum)
			{
				$scope.selectPage(pages[pageNum - 1]);
			}

			this.addPage = function(page)
			{
				if($scope.pages.length === 0)
				{
					$scope.selectPage(page);
				}
				pages.push(page);
			}
		},

		template: '<div class = container">' + 
				  '<ul class = "nav">' + 
				  '<li ng-repeat = "page in pages" id = "menu-container"> {{page.num}} </li>' + 
				  '</ul>' + 
				  '<div ng-transclude> </div>'+
				  '</div>'

	};

});

app.directive('myPanes' , function(){

	return{

		require: '^^formPane',
		restrict: 'EA',
		transclude: true,
		scope:{
			num: "@"
		},
		controller: function($scope , $window)
		{
			$scope.submitForm = function()
			{
				$window.alert("Form Successfully Submitted!!");
			}
		},
		link: function (scope , element , attr , formsCtrl) //Used Mainly for DOM Manipulation ...
		{
			formsCtrl.addPage(scope);

			scope.showPreviousPage = function(page)
			{
				var currentPageNumber = Number(page.replace("Page" , ""));
				prevPageNumber = currentPageNumber - 1;
				formsCtrl.showPrev(prevPageNumber);
			}

			scope.showNextPage = function(page)
			{
				var currentPageNumber = Number(page.replace("Page" , ""));
				nextPageNumber = currentPageNumber + 1;
				formsCtrl.showNext(nextPageNumber); 
			}
		},
		template: '<div class = "content" ng-show = "selected">' + 
				  '<div ng-transclude> </div>' +
				  '<span class = "footer-class-left" ng-show = "previous" ng-click = "showPreviousPage(num)"> Previous </span>' + 
				  '<span class = "footer-class-right" ng-show = "next" ng-click = "showNextPage(num)"> Next </span>' +
				  '<span class = "footer-class-right" ng-show = "confirm" ng-click = "submitForm()"> Confirm </span>' + 
				  '</div>'

	};

});
