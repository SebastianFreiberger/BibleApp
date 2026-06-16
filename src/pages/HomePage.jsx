import { useState, useMemo } from 'react'
import { Header, Footer, DailyVerseTab, MoodSearchTab } from '../components'
import { useTheme, useDailyVerse, useMoodSearch, useFavorites } from '../hooks'
import { UI_TEXT, getDailyAttribute } from '../data'
import { useLang } from '../context'

export function HomePage() {
  const { lang, bibleVersion } = useLang()
  const [activeTab, setActiveTab] = useState('daily')
  
  const { theme, toggleTheme } = useTheme()
  
  const {
    currentVerse,
    loading,
    loadingRandom,
    showRandom,
    generateRandomVerse,
    backToDaily
  } = useDailyVerse(lang, bibleVersion)

  const {
    searchQuery,
    setSearchQuery,
    searchResult,
    loadingMood,
    expandedVerse,
    hasSearched,
    handleSearch,
    selectMoodCategory,
    toggleExpandedVerse
  } = useMoodSearch(lang, bibleVersion)

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

  const dailyAttribute = useMemo(() => getDailyAttribute(lang), [lang])

  const t = UI_TEXT[lang]

  const handleToggleFavorite = (verse) => {
    if (isFavorite(verse.reference, verse.text)) {
      removeFavorite(verse.reference, verse.text)
    } else {
      addFavorite(verse)
    }
  }

  return (
    <div className="app">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDailyTabClick={backToDaily}
        favorites={favorites}
        t={t}
      />

      <main className="main">
        {activeTab === 'daily' && (
          <DailyVerseTab
            loading={loading}
            currentVerse={currentVerse}
            showRandom={showRandom}
            loadingRandom={loadingRandom}
            generateRandomVerse={generateRandomVerse}
            backToDaily={backToDaily}
            dailyAttribute={dailyAttribute}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            t={t}
          />
        )}

        {activeTab === 'mood' && (
          <MoodSearchTab
            lang={lang}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResult={searchResult}
            loadingMood={loadingMood}
            expandedVerse={expandedVerse}
            hasSearched={hasSearched}
            handleSearch={handleSearch}
            selectMoodCategory={selectMoodCategory}
            toggleExpandedVerse={toggleExpandedVerse}
            t={t}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
