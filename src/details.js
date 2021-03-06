import { Component } from "react";
import { withRouter } from "react-router";
import Carousel from "./Carousel";
import ErrorBounday from "./ErrorBoundary";
import ThemeContext from "./ThemeContext";
import Modal from "./Modal";
class Details extends Component {
  // constructor() {
  //   super(); // need to be called because react wants constructor of Component class
  //   this.state = {
  //     loading: false,
  //   };
  // }
  state = {
    loading: true,
    showModal: false,
  };

  async componentDidMount() {
    // this will be called just the first time
    // - ideal for the case when you want to put the [JUST SMILE] component on load
    const res = await fetch(
      `https://pets-v2.dev-apis.com/pets?id=${this.props.match.params.id}`
    );
    const json = await res.json();
    this.setState(
      Object.assign(
        {
          loading: false,
        },
        json.pets[0]
      )
    );
  }

  // for toggling modal
  toggleModal = () => this.setState({ showModal: !this.state.showModal });
  // adopt - what to do if they adopt it
  adopt = () => {
    window.location = "https://bit.ly/pet-adopt";
  };

  render() {
    if (this.state.loading) {
      return <h2>loading...</h2>;
    }
    const { animal, breed, city, state, description, name, images, showModal } =
      this.state;
    return (
      <div className="details">
        <Carousel images={images} />
        <div>
          <h1>{name}</h1>
          <h2>{`${animal} - ${breed} - ${city}, ${state}`}</h2>
          <ThemeContext.Consumer>
            {([theme]) => (
              <button
                onClick={this.toggleModal}
                style={{ backgroundColor: theme }}
              >
                Adopt {name}
              </button>
            )}
          </ThemeContext.Consumer>
          <p>{description}</p>
          {showModal ? (
            <Modal>
              <div>
                <h2>Would you like to adopt {name}?</h2>
                <div className="buttons">
                  <button onClick={this.adopt}>Yes</button>
                  <button onClick={this.toggleModal}>No</button>
                </div>
              </div>
            </Modal>
          ) : null}
        </div>
      </div>
    );
  }
}

const DetailsWithRounter = withRouter(Details);
/*
// this was code before adding error boundary
// this with router will pass all that values in the details
// export default withRouter(Details);
*/

/**
 * if we have used it like wrapped the returning part with it then it won't have caught the errors that may occur in the methods of the class so we made another component that will wrap while thing and then returned the combined element
 * @returns Combined element with error boundary
 */
export default function DetailsWithErrorBoundary() {
  return (
    <ErrorBounday>
      <DetailsWithRounter />
    </ErrorBounday>
  );
}
