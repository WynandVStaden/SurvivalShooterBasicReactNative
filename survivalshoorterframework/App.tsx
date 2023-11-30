import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native';

const { width, height } = Dimensions.get('window');
const PLAYER_SIZE = 50;
const ENEMY_SIZE = 50;

const SurvivalShooter = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: width / 2 - PLAYER_SIZE / 2, y: height - PLAYER_SIZE - 10 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const movePlayerLeft = () => {
      if (playerPosition.x > 0) {
        setPlayerPosition((prev) => ({ ...prev, x: prev.x - 10 }));
      }
    };

    const movePlayerRight = () => {
      if (playerPosition.x < width - PLAYER_SIZE) {
        setPlayerPosition((prev) => ({ ...prev, x: prev.x + 10 }));
      }
    };

  const movePlayer = (dx) => {
    if (!gameOver) {
      setPlayerPosition((prev) => ({ ...prev, x: prev.x + dx }));
    }
  };

  const shoot = () => {
    if (!gameOver) {
      setBullets((prev) => [...prev, { x: playerPosition.x + PLAYER_SIZE / 2 - 2.5, y: playerPosition.y - 10 }]);
    }
  };

 useEffect(() => {
   const moveBullets = setInterval(() => {
     setBullets((prev) => prev.map((bullet) => ({ ...bullet, y: bullet.y - 5 })));
   }, 16);

   const spawnEnemies = () => {
     setEnemies((prev) => [...prev, { x: width*Math.random(), y: height*Math.random() - height/2}]);
   };

   const moveEnemies = setInterval(() => {
     spawnEnemies();
     setEnemies((prev) => prev.map((enemy) => ({ ...enemy, y: enemy.y + 2 })));
   }, 200);

   const checkCollisions = () => {
     bullets.forEach((bullet) => {
       enemies.forEach((enemy) => {
         if (
           bullet.x < enemy.x + ENEMY_SIZE &&
           bullet.x + 5 > enemy.x &&
           bullet.y < enemy.y + ENEMY_SIZE &&
           bullet.y + 10 > enemy.y
         ) {
           setScore((prev) => prev + 1);
           setEnemies((prev) => prev.filter((e) => e !== enemy));
           setBullets((prev) => prev.filter((b) => b !== bullet));
         }
       });
     });

     enemies.forEach((enemy) => {
       if (
         playerPosition.x < enemy.x + ENEMY_SIZE &&
         playerPosition.x + PLAYER_SIZE > enemy.x &&
         playerPosition.y < enemy.y + ENEMY_SIZE &&
         playerPosition.y + PLAYER_SIZE > enemy.y
       ) {
         setGameOver(true);
         clearInterval(moveBullets);
         clearInterval(moveEnemies);
       }
     });
   };

   const collisionDetection = setInterval(() => {
     checkCollisions();
   }, 16);

   return () => {
     clearInterval(moveBullets);
     clearInterval(moveEnemies);
     clearInterval(collisionDetection);
   };
 }, [bullets, enemies, gameOver, playerPosition, score]);

  return (
    <TouchableWithoutFeedback
      onPressIn={() => movePlayer(-10)}
      onPressOut={() => movePlayer(10)}
      onPress={() => shoot()}>
      <View style={styles.container}>
        <View style={[styles.player, { left: playerPosition.x, top: playerPosition.y }]} />
        {bullets.map((bullet, index) => (
          <View key={`bullet-${index}`} style={[styles.bullet, { left: bullet.x, top: bullet.y }]} />
        ))}
        {enemies.map((enemy, index) => (
          <View key={`enemy-${index}`} style={[styles.enemy, { left: enemy.x, top: enemy.y }]} />
        ))}
         {/* Buttons to move the player left and right */}
              <TouchableOpacity style={styles.moveButton} onPress={movePlayerLeft}>
                <Text style={styles.buttonText}>Left</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moveButton} onPress={movePlayerRight}>
                <Text style={styles.buttonText}>Right</Text>
              </TouchableOpacity>
        {gameOver && (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>Game Over!</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    backgroundColor: 'blue',
  },
    moveButton: {
      backgroundColor: 'blue',
      padding: 10,
      margin: 5,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  bullet: {
    position: 'absolute',
    width: 5,
    height: 10,
    backgroundColor: 'red',
  },
  enemy: {
    position: 'absolute',
    width: ENEMY_SIZE,
    height: ENEMY_SIZE,
    backgroundColor: 'green',
  },
  gameOverContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  scoreText: {
    fontSize: 18,
    color: 'black',
  },
});

export default SurvivalShooter;
