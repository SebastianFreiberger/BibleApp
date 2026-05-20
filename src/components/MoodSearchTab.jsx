import { Search, Loader, ChevronDown, ChevronRight } from 'lucide-react'
import { MOOD_ICONS, MOOD_REFERENCES } from '../data'

export function MoodSearchTab({
  lang,
  searchQuery,
  setSearchQuery,
  searchResult,
  loadingMood,
  expandedVerse,
  handleSearch,
  selectMoodCategory,
  toggleExpandedVerse,
  t
}) {
  return (
    <div className="mood-section">
      <div className="search-container">
        <h2>{t.moodTitle}</h2>
        <p className="search-subtitle">{t.moodSubtitle}</p>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary" disabled={loadingMood}>
            {loadingMood ? <Loader size={18} className="spin" /> : <Search size={18} />} {t.searchBtn}
          </button>
        </form>
      </div>

      <MoodCategories 
        lang={lang}
        searchResult={searchResult}
        loadingMood={loadingMood}
        selectMoodCategory={selectMoodCategory}
      />

      {loadingMood && (
        <div className="loading">
          <div className="spinner"></div>
          <p>{t.searchingVerses}</p>
        </div>
      )}

      {searchResult && !loadingMood && (
        <SearchResults 
          lang={lang}
          searchResult={searchResult}
          expandedVerse={expandedVerse}
          toggleExpandedVerse={toggleExpandedVerse}
        />
      )}

      {searchQuery && !searchResult && !loadingMood && (
        <div className="no-results">
          <p>😔 {t.noResults} "{searchQuery}"</p>
          <p>{t.tryWith}</p>
        </div>
      )}
    </div>
  )
}

function MoodCategories({ lang, searchResult, loadingMood, selectMoodCategory }) {
  return (
    <div className="mood-categories">
      {Object.entries(MOOD_REFERENCES).map(([key, mood]) => {
        const IconComponent = MOOD_ICONS[key]
        return (
          <button
            key={key}
            className={'mood-chip mood-' + key + ' ' + (searchResult && searchResult.key === key ? 'active' : '')}
            onClick={() => selectMoodCategory(key)}
            disabled={loadingMood}
          >
            <span className="mood-icon"><IconComponent size={18} /></span>
            <span className="mood-label">{mood.title[lang] || mood.title.es}</span>
          </button>
        )
      })}
    </div>
  )
}

function SearchResults({ lang, searchResult, expandedVerse, toggleExpandedVerse }) {
  const ResultIcon = MOOD_ICONS[searchResult.iconKey]
  const categoryTitle = MOOD_REFERENCES[searchResult.key].title[lang] || MOOD_REFERENCES[searchResult.key].title.es

  return (
    <div className="search-results">
      <div className="search-result-header">
        <p className="search-term">"{searchResult.searchTerm}"</p>
        <h3 className={'results-title mood-result-' + searchResult.key}>
          <span className="result-icon"><ResultIcon size={24} /></span> {categoryTitle}
        </h3>
      </div>
      <div className="verses-list">
        {searchResult.verses.map((verse, index) => (
          <div 
            key={index} 
            className={'verse-item ' + (expandedVerse === index ? 'expanded' : '')}
            onClick={() => toggleExpandedVerse(index)}
          >
            <div className="verse-item-header">
              <span className="verse-item-reference">{verse.reference}</span>
              <span className="verse-item-toggle">
                {expandedVerse === index ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </span>
            </div>
            {expandedVerse === index && (
              <p className="verse-item-text">"{verse.text}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
