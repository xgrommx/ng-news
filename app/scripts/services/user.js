'use strict';

app.factory('User', function($firebase, FIREBASE_URL, Auth, $rootScope) {
	var ref = new Firebase(FIREBASE_URL + 'users');

	var users = $firebase(ref);

	function setCurrentUser (username) {
  		$rootScope.currentUser = User.findByUsername(username);
	}

	var User = {
		create: function(authUser, username) {
			users[username] = {
				md5_hash: authUser.md5_hash,
				username: username,
				$priority: authUser.uid
			};

			users.$save(username).then(function() {
				setCurrentUser(username);
			});
		},
		findByUsername: function (username) {
  			if (username) {
				return users.$child(username);
  			}
		},
		getCurrent: function () {
  			return $rootScope.currentUser;
		},
		signedIn: function () {
  			return $rootScope.currentUser !== undefined;
		}
	};

	$rootScope.$on('$firebaseSimpleLogin:login', function (e, authUser) {
  		var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));
 
		query.$on('loaded', function () {
			setCurrentUser(query.$getIndex()[0]);
			console.log($rootScope.currentUser, 'login');
  		});
	});

	$rootScope.$on('$firebaseSimpleLogin:logout', function() {
		console.log($rootScope.currentUser, 'logout');
  		delete $rootScope.currentUser;
	});

	return User;
});