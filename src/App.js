import React from 'react';
import './App.css';

import Header from './components/Header'
import ToyForm from './components/ToyForm'
import ToyContainer from './components/ToyContainer'


class App extends React.Component{

  state = {
    display: false,
    toys: []
  }

  componentDidMount() {
    fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(json => this.setState({toys: json}))
  }

  handleClick = () => {
    let newBoolean = !this.state.display
    this.setState({
      display: newBoolean
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name": e.target.name.value,
        "image": e.target.image.value,
        "likes": 0
      })
    })
    .then(resp => resp.json())
    .then(toy => this.setState({toys:[...this.state.toys, toy]}))
  }

  updateLikesInDb = (toy) => {
    console.log(`${toy.name} Liked`)
    let newLikes = toy.likes + 1
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "likes": newLikes
      })
    })
    .then(resp => resp.json())
    .then(console.log)
  }

  updateLikes = (toy) => {
    this.updateLikesInDb(toy)
    this.setState(prevState => {
      let oldToy = prevState.toys.find(stateToy => toy === stateToy)
      oldToy.likes = oldToy.likes + 1
      return {
        toys: prevState.toys
      }
    })
  }

  deleteToyInDb = (toy) => {
    console.log('working')
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'DELETE'
    })
    .then(resp => resp.json())
    // .then(json => this.setState(prevState => {
    //   let oldToy = prevState.toys.find(stateToy => json === stateToy)
    //   return {
    //     toys: prevState.toys.splice(oldToy.id-1, 1)
    //   }
    // }))
  }

  deleteToy = (toy) => {
    this.deleteToyInDb(toy)
    this.setState(prevState => {
      let oldToy = prevState.toys.find(stateToy => toy === stateToy)
      prevState.toys.splice(oldToy.id-1, 1)
      return {
        toys: prevState.toys
      }
    })
  }

  render(){
    console.log(this.state.toys)
    return (
      <>
        <Header/>
        { this.state.display
            ?
          <ToyForm handleSubmit={this.handleSubmit}/>
            :
          null
        }
        <div className="buttonContainer">
          <button onClick={this.handleClick}> Add a Toy </button>
        </div>
        <ToyContainer toys={this.state.toys} updateLikes={this.updateLikes} deleteToy={this.deleteToy}/>
      </>
    );
  }

}

export default App;
