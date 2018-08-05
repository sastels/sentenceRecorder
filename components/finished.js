import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  app: {
    textAlign: "center",
    padding: "10px"
  },
  title: {
    marginBottom: 4 * theme.spacing.unit
  },
  textFieldContainer: {
    marginBottom: 8 * theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  button: {
    textTransform: "none",
    margin: theme.spacing.unit,
    marginBottom: 4 * theme.spacing.unit
  }
});

class Finished extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.app}>
        <Typography variant="headline" className={classes.title}>
          You're done!
        </Typography>
        <Typography variant="headline" className={classes.title}>
          Thanks for reading. Come back later and we'll guess your accent and
          age!
        </Typography>
        <Typography variant="headline" className={classes.title}>
          Leave an email address and we will let you know when guessing is up
          and running.
        </Typography>

        <div>
          <TextField
            id="email"
            label="email address"
            className={classes.textField}
            value={this.props.email}
            onChange={this.props.handleTextInput("email")}
            margin="normal"
          />
        </div>
      </div>
    );
  }
}

Finished.propTypes = {
  classes: PropTypes.object.isRequired,
  email: PropTypes.string.isRequired,
  handleTextInput: PropTypes.func.isRequired,
  nextSection: PropTypes.func.isRequired
};

export default withStyles(styles)(Finished);
