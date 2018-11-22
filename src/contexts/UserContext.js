import React, { Component } from 'react'
import api from '../api'

const {Provider, Consumer} = React.createContext()

export default class UserProvider extends Component {
  state = {
    id: null,
    username: null
  }

  componentDidMount = async () => {
    localStorage.getItem('token') && await this.refreshUser()
  }

  login = async (username, password) => {
    const res = await api.post('/users/login', {
      username,
      password
    })
    localStorage.setItem('token', res.data.token)

    await this.refreshUser()
    
    // 로그인 폼 보여주기
    this.props.onPostListPage()
  }

  logout = () => {
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('token')
    // 사용자 정보 캐시 초기화
    this.setState({
      id: null,
      username: null
    })
  }

  refreshUser = async() => {
    const res2 = await api.get('/me')
    this.setState({
      id: res2.data.id,
      username: res2.data.username
    })
  }

  render() {
    const value = {
      username: this.state.username,
      id: this.state.id,
      login: this.login.bind(this),
      logout: this.logout.bind(this)
    }
    return (
      <Provider value={value}>{this.props.children}</Provider>
    )
  }
}

export {
  UserProvider,
  Consumer as UserConsumer
}