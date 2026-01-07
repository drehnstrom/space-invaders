angular.module('appname')
  .controller('AliensController', function($scope, $http, $interval, $document, $timeout) {

    $scope.pageName = "Aliens";

    var promise;
    var timeoutPromise
    var hero;
    var enemy;
    var missile;
    var bomb;
    var missileHitThisFrame = false;
    var explosionImage;
    var heroImage;
    var enemyImage;
    var bombImage;
    var missileImage;
    var winningScore = 100;
    
    function init() {
      initializeGameObjects();
      resetScore();
      getImageURLs();
      updateImages();
    }
    
    // Initialize the game
    init();
    
    function resetScore(){
      $scope.score = 0;
      $scope.lives = 10;
    }
    function initializeGameObjects(){
      hero = {
        left: 10,
        direction: 1,
        speed: 15,
        image: "hero.svg"
      };
      enemy = {
        left: 25,
        direction: 1,
        speed: 5,
        image: "enemy.svg"
      };
      missile = {
        left: 0,
        top: 500,
        speed: 20,
        image: "missile.svg"
      };
      bomb = {
        left: 100,
        top: 500,
        speed: 5,
        rotation: 0,
        image: "bomb.svg",
        exploding:false
      };
      
      $scope.missiletop = missile.top + "px";
      $scope.missileleft = missile.left + "px";
      $scope.bombtop = bomb.top + "px";
      $scope.bomvleft = bomb.left + "px";
      $scope.bombrotation = bomb.rotation + "deg";
    }
    
    function getImageURLs(){
      $http.get(hero.image)
      .then(function(response) {
        heroImage = response.data;
        document.querySelector('.hero').innerHTML = heroImage;
      });

    $http.get(enemy.image)
      .then(function(response) {
        enemyImage = response.data;
        document.querySelector('.enemy').innerHTML = enemyImage;
      });

    $http.get(missile.image)
      .then(function(response) {
        missileImage = response.data;
        document.querySelector('.missile').innerHTML = missileImage;
      });

    $http.get(bomb.image)
      .then(function(response) {
        bombImage = response.data;
        document.querySelector('.bomb').innerHTML = bombImage;
      });
      
      $http.get('explosion.svg')
      .then(function(response) {
         explosionImage = response.data;
      });
    }
    
    function updateImages(){
      document.querySelector('.hero').innerHTML = heroImage;
      document.querySelector('.enemy').innerHTML = enemyImage;
      document.querySelector('.missile').innerHTML = missileImage;
      document.querySelector('.bomb').innerHTML = bombImage;
      
    }

    $scope.showMissile = function() {
      return (missile.top < 500 && missile.top >= 0);
    };

    $scope.startGame = function() {

      // MAKE SURE THE GAME ISN'T RUNNING ALREADY
      $interval.cancel(promise);
      
      // Make sure the Images are correct
      updateImages();
      
      // Starts the loop to run the game. 
      // Promise object is used to stop the loop
      promise = $interval(function() {
        
        // Reset hit tracking for this frame
        missileHitThisFrame = false;

        // Move the hero  
        $scope.heroleft = hero.left + "px";

        // Move the enemy
        if (enemy.left > 700 || enemy.left < 1) enemy.direction *= -1;
        enemy.left = enemy.left + (enemy.speed * enemy.direction);
        $scope.enemyleft = enemy.left + "px";

        // Check collisions BEFORE moving missile
        // See if the missile hits the bomb
        if (!missileHitThisFrame && missile.top <= 500 && missile.top >= -50 && !bomb.exploding &&
            missile.left + 10 > bomb.left && missile.left < bomb.left + 50 && 
            missile.top >= bomb.top && missile.top <= bomb.top + 50) {
          // It's a hit
          missileHitThisFrame = true;
          $scope.score += 1;
          bomb.rotation = 0;
          bomb.top = 60;
          bomb.left = enemy.left + 50;
          missile.top = 500;
        }

        // See if the missile hits the enemy
        if (!missileHitThisFrame && missile.top <= 500 && missile.top >= -50 && 
            missile.left + 10 > enemy.left && missile.left < enemy.left + 100 && 
            missile.top >= 10 && missile.top <= 110) {
          // It's a hit
          missileHitThisFrame = true;
          $scope.score += 10;
          missile.top = 500;
          
          // Show explosion effect on enemy
          var enemyDiv = document.querySelector('.enemy');
          var savedEnemy = enemyDiv.innerHTML;
          enemyDiv.innerHTML = explosionImage;
          
          $timeout(function(){
            enemyDiv.innerHTML = savedEnemy;
          }, 200);
        }

        // Move the missile AFTER checking collisions
        if (missile.top <= 500 && missile.top >= -50) {
          missile.top = missile.top - missile.speed;
          if (missile.top < -50) missile.top = 500;
          $scope.missiletop = missile.top + "px";
          $scope.missileleft = missile.left + "px";
        }

        // Move the Bomb
        if (bomb.top < 450 && ! bomb.exploding) {
          bomb.top = bomb.top + bomb.speed;
          
          // Check if bomb hit the ground
          if (bomb.top >= 450) {
            bomb.top = 450;
            bomb.exploding = true;
            document.querySelector('.bomb').innerHTML = explosionImage;
            
            $timeout.cancel(timeoutPromise);
            timeoutPromise = $timeout(function(){
              bomb.rotation = 0;
              bomb.top = 60;
              bomb.left = enemy.left + 50;
              bomb.exploding = false;
              document.querySelector('.bomb').innerHTML = bombImage;
            }, 200);
          }

          bomb.rotation = bomb.rotation + 6;
          if (bomb.rotation >= 360) bomb.rotation = 0;

          $scope.bombtop = bomb.top + "px";
          $scope.bombleft = bomb.left + "px";
          $scope.bombrotation = bomb.rotation + "deg"
  
        } 
        else if(bomb.exploding){
          //do nothing
        }
        else {
          bomb.rotation = 0;
          bomb.top = 60;  // Just below the enemy (enemy at 10px + enemy height 100px)
          bomb.left = enemy.left + 50;
        }

        // See if the bomb hits the hero
        if (!bomb.exploding && bomb.left > hero.left && bomb.left < hero.left + 100 && bomb.top > 340 && bomb.top < 450) {
          // It's a hit
          $scope.lives -= 1;
          
          bomb.exploding = true;
          document.querySelector('.bomb').innerHTML = explosionImage;
          
          $timeout.cancel(timeoutPromise);  //does nothing, if timeout alrdy done
          timeoutPromise = $timeout(function(){   
            document.querySelector('.bomb').innerHTML = explosionImage;//Set timeout
              bomb.rotation = 0;
              bomb.top = 60;
              bomb.left = enemy.left + 50;
              bomb.exploding = false;
              document.querySelector('.bomb').innerHTML = bombImage;
          }, 200);
        
        }

        // See if the missile hits the bomb
        if (!missileHitThisFrame && missile.top >= 0 && missile.top < 500 && !bomb.exploding &&
            missile.left + 10 > bomb.left && missile.left < bomb.left + 50 && 
            missile.top >= bomb.top && missile.top <= bomb.top + 50) {
          // It's a hit
          missileHitThisFrame = true;
          $scope.score += 1;
          bomb.rotation = 0;
          bomb.top = 60;
          bomb.left = enemy.left + 50;
          missile.top = 500;
        }

        // See if the missile hits the enemy
        if (missile.top >= 0 && missile.top < 500 && 
            missile.left + 10 > enemy.left && missile.left < enemy.left + 100 && 
            missile.top >= 10 && missile.top <= 110) {
          // It's a hit
          $scope.score += 10;
          missile.top = 500;
          
          // Show explosion effect on enemy
          var enemyDiv = document.querySelector('.enemy');
          var savedEnemy = enemyDiv.innerHTML;
          enemyDiv.innerHTML = explosionImage;
          
          $timeout(function(){
            enemyDiv.innerHTML = savedEnemy;
          }, 200);
        }

      }, 25);
    }

    $scope.$watch("lives", function(newValue) {
      if (newValue <= 0 && promise) {
        $interval.cancel(promise);
        promise = null;
        document.querySelector('.hero').innerHTML = explosionImage;
      }
    });

    $scope.$watch("score", function(newValue) {
      if (newValue >= winningScore && promise) {
        $interval.cancel(promise);
        promise = null;
        document.querySelector('.enemy').innerHTML = explosionImage;
      }
    });

    $scope.pauseGame = function() {
      if (promise) {
        $interval.cancel(promise);
      }
    }

    $scope.resetGame = function() {
     init();
    }

    var handleKeyDown = function(event) {
      switch (event.keyCode) {
        case 37: // Left
          hero.left = hero.left - hero.speed;
          if (hero.left < 0) hero.left = 0;
          break;
        case 39: // Right
          hero.left = hero.left + hero.speed;
          if (hero.left > 700) hero.left = 700;
          break;
        case 32: // Space
          missile.left = hero.left + 50;
          missile.top = 200;
          break;
      }
      $scope.$apply();
    };

    $document.on('keydown', handleKeyDown);

    $scope.$on('$destroy', function() {
      $document.unbind('keydown', handleKeyDown);
    });



  })