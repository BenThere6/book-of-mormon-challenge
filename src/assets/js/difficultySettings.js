const getDifficultySettings = (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return { 
        multiplier: 1, 
        chapterRange: 15, 
        verseRange: 20, 
        bombCount: 3, 
        skipCount: 3,
        removePercentage: 70,
        timer: 45
      };
    case 'medium':
      return { 
        multiplier: 8, 
        chapterRange: 7, 
        verseRange: 10, 
        bombCount: 3, 
        skipCount: 2,
        removePercentage: 60,
        timer: 30
      };
    case 'hard':
      return { 
        multiplier: 12, 
        chapterRange: 3, 
        verseRange: 8, 
        bombCount: 3, 
        skipCount: 1,
        removePercentage: 50,
        timer: 15
      };
    default:
      console.log('Invalid difficulty level: ' + difficulty);
      return null;
  }
};

export default getDifficultySettings;