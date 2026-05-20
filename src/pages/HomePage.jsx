import { useState, useMemo } from 'react'
import { Header, Footer, DailyVerseTab, MoodSearchTab } from '../components'
import { useTheme, useDailyVerse, useMoodSearch } from '../hooks'
import { UI_TEXT, getDailyAttribute } from '../data'

export function HomePage() {
  const [lang, setLang] = useState('es')
  const [activeTab, setActiveTab] = useState('daily')
  
  const { theme, toggleTheme } = useTheme()
  
  const {
    currentVerse,
    loading,
    loadingRandom,
    showRandom,
    generateRandomVerse,
    backToDaily
  } = useDailyVerse(lang)
  
  const {
    searchQuery,
    setSearchQuery,
    searchResult,
    loadingMood,
    expandedVerse,
    handleSearch,
    selectMoodCategory,
    toggleExpandedVerse
  } = useMoodSearch(lang)

  const dailyAttribute = useMemo(() => getDailyAttribute(lang), [lang])

  const t = UI_TEXT[lang]

  return (
    <div className="app">
      <Header 
        lang={lang}
        setLang={setLang}
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
            lang={lang}
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
            handleSearch={handleSearch}
            selectMoodCategory={selectMoodCategory}
            toggleExpandedVerse={toggleExpandedVerse}
            t={t}
          />
        )}
      </main>

      <Footer lang={lang} t={t} />
    </div>
  )
}
