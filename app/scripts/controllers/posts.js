'use strict';

app.controller('PostsCtrl', ['$scope', '$location', 'Post', function ($scope, $location, Post) {
	$scope.posts = Post.all;
	$scope.post = {url: 'http://', title: ''};

    if($location.path() === '/') {
        $scope.posts = Post.all;
    }

	$scope.submitPost = function() {
		Post.create($scope.post).then(function(ref) {
			$location.path('/posts/' + ref.name());
			//$scope.post = {url: 'http://', title: ''};
		});
	};

	$scope.deletePost = function(postId) {
		Post.delete({id: postId}, function() {
			delete $scope.posts[postId];
		});
	};

    $scope.upVotePost = function (postId, upVoted) {
        if (upVoted) {
            Post.clearVote(postId, upVoted);
        } else {
            Post.upVote(postId);
        }
    };

    $scope.downVotePost = function (postId, downVoted) {
        if (downVoted) {
            Post.clearVote(postId, !downVoted);
        } else {
            Post.downVote(postId);
        }
    };

    $scope.upVoted = function (post) {
        return Post.upVoted(post);
    };

    $scope.downVoted = function (post) {
        return Post.downVoted(post);
    };
}]);