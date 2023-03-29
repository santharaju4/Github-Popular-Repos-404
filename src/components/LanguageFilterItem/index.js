import './index.css'

const LanguageFilterItem = props => {
  const {languageDetails, isActive, setActiveLanguageFilterId} = props
  console.log(languageDetails)
  const {id, language} = languageDetails

  const className = isActive
    ? 'language-btn active-language-btn'
    : 'language-btn'

  const onClickBtn = () => {
    setActiveLanguageFilterId(id)
  }

  return (
    <li>
      <button type="button" className={className} onClick={onClickBtn}>
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
