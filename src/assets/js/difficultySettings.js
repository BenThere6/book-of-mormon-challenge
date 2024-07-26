const getDifficultySettings = (difficulty) => {
    switch (difficulty) {
        case 'easy':
            return { multiplier: 1, chapterRange: 15, verseRange: 20, bombCount: 4, removeBookCount: 6, removeChapterCount: 7, removeVerseCount: 10 };
        case 'medium':
            return { multiplier: 8, chapterRange: 7, verseRange: 10, bombCount: 3, removeBookCount: 5, removeChapterCount: 6, removeVerseCount: 9 };
        case 'hard':
            return { multiplier: 12, chapterRange: 3, verseRange: 8, bombCount: 2, removeBookCount: 4, removeChapterCount: 5, removeVerseCount: 8 };
        default:
            console.log('Invalid difficulty level: ' + difficulty);
            return null;
    }
};

export default getDifficultySettings;  