import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

class GithubPopularRepos extends Component {
  state = {
    activeLanguageFilterId: languageFiltersData[0].id,
    repositoryData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRepository()
  }

  getRepository = async () => {
    const {activeLanguageFilterId} = this.state

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilterId}`
    console.log(apiUrl)
    const response = await fetch(apiUrl)
    const fetchedData = await response.json()
    console.log(fetchedData)
    if (response.ok) {
      const updatedData = fetchedData.popular_repos.map(eachData => ({
        id: eachData.id,
        name: eachData.name,
        issuesCount: eachData.issues_count,
        forksCount: eachData.forks_count,
        starsCount: eachData.stars_count,
        imageUrl: eachData.avatar_url,
      }))
      console.log(updatedData)
      this.setState({
        repositoryData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderInProgressView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
        className=".failure-view-image"
      />
    </div>
  )

  renderSuccessView = () => {
    const {repositoryData} = this.state
    return (
      <ul className="repositories-list">
        {repositoryData.map(eachRepository => (
          <RepositoryItem
            key={eachRepository.id}
            repositoryDetails={eachRepository}
          />
        ))}
      </ul>
    )
  }

  renderGithubPopularRepos = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderInProgressView()

      default:
        return null
    }
  }

  setActiveLanguageFilterId = id => {
    this.setState({activeLanguageFilterId: id}, this.getRepository)
  }

  render() {
    const {activeLanguageFilterId, repositoryData} = this.state
    console.log(repositoryData)
    return (
      <div className="app-container">
        <div className="responsive-container">
          <h1 className="heading">Popular</h1>
          <ul className="filters-list ">
            {languageFiltersData.map(eachLanguage => (
              <LanguageFilterItem
                key={eachLanguage.id}
                languageDetails={eachLanguage}
                isActive={eachLanguage.id === activeLanguageFilterId}
                setActiveLanguageFilterId={this.setActiveLanguageFilterId}
              />
            ))}
          </ul>
          {this.renderGithubPopularRepos()}
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
