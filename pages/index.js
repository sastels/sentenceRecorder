import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";

require("isomorphic-fetch");
const uuid = require("uuid");
import RecordAudio from "../components/recordAudio";
import Profile from "../components/profile";
import Finished from "../components/finished";

const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px"
  },
  title: {
    marginBottom: 4 * theme.spacing.unit
  }
});

class App extends Component {
  state = {
    section: "profile",
    country: "",
    city: "",
    age: "",
    email: ""
  };

  handleTextInput = field => event => {
    this.setState({
      [field]: event.target.value
    });
  };

  uploadAudio = (sentence, blob) => {
    return 0;

    let fd = new FormData();
    fd.append("audio", blob);
    fd.append("sentence", sentence);
    fd.append("country", this.state.country);
    fd.append("city", this.state.city);
    fd.append("age", this.state.age);
    fd.append("id", uuid.v4());
    fd.append("date", new Date().toUTCString());
    fetch("/submitBlob", {
      headers: { Accept: "application/json" },
      method: "POST",
      body: fd
    }).then(result => {
      console.log("fetch result:", result); // eslint-disable-line no-console
    });
  };

  sectionToDisplay = section => {
    switch (section) {
      case "profile":
        return (
          <Profile
            nextSection={() => this.setState({ section: "recorder" })}
            handleTextInput={this.handleTextInput}
          />
        );
      case "recorder":
        return (
          <RecordAudio
            nextSection={() => this.setState({ section: "finished" })}
            uploadAudio={this.uploadAudio}
          />
        );
      case "finished":
        return (
          <Finished
            nextSection={() => this.setState({ section: "finished" })}
            email={this.state.email}
            handleTextInput={this.handleTextInput}
          />
        );
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.app}>
        {/*<Typography variant="display1" className={classes.title}>*/}
        {/*Sentence Recorder*/}
        {/*</Typography>*/}
        {this.sectionToDisplay(this.state.section)}
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
