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
  const es = lang === 'es'
  const categories = searchResult.categories?.length ? searchResult.categories : [searchResult.key]

  return (
    <div className="search-results">
      <div className="search-result-header">
        <p className="search-term">"{searchResult.searchTerm}"</p>

        <div className="detected-emotions">
          <span className="detected-label">
            {es ? 'Emociones detectadas' : 'Detected emotions'}
          </span>
          <div className="detected-chips">
            {categories.map(key => {
              const Icon = MOOD_ICONS[key]
              const title = MOOD_REFERENCES[key]?.title?.[lang] || MOOD_REFERENCES[key]?.title?.es || key
              return (
                <span key={key} className={'detected-chip detected-chip-' + key}>
                  {Icon && <Icon size={13} />}
                  {title}
                </span>
              )
            })}
          </div>
        </div>
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
