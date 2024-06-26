import React, { useState } from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, Typography, makeStyles, createMuiTheme, ThemeProvider, Modal, Backdrop, Fade } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';


// Define a custom theme
const theme = createMuiTheme({
  palette: {
    type: 'dark', // Use dark mode to get black buttons
    primary: {
      main: '#FFEB3B', // Yellow background
    },
    text: {
      primary: '#FFFFFF', // White text color
    },
  },
});

// Styles for notes
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main, // Use primary color for background
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[3],
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
  },
  content: {
    flex: 1,
    padding: theme.spacing(2),
  },
  title: {
    fontWeight: 'bold', // Make title bold
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
  },
  completed: {
    textDecoration: 'line-through',
    color: theme.palette.text.secondary,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// Note props
const NoteItem = ({ note, handleOpen, handleDeleteNote, handleCheckboxToggle }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  // Function to truncate content if it has more than 10 words
  const truncateContent = (content) => {
    const words = content.split(' ');
    if (words.length <= 10) {
      return content;
    } else {
      return `${words.slice(0, 10).join(' ')}...`;
    }
  };

  // Notes UI
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root} onClick={handleModalOpen}>
        <div className={classes.content}>
          <Typography variant="h6" className={classes.title} style={{ color: theme.palette.text.primary }}>{note.title}</Typography>
          <Typography variant="body1" color="textPrimary">{truncateContent(note.content)}</Typography>
          {note.actionItems.map((item) => (
            <div key={item.id} className={classes.actionItem}>
              <Checkbox
                checked={item.completed}
                onChange={() => handleCheckboxToggle(item.id)}
                color="primary"
              />
              <Typography variant="body2" className={item.completed ? classes.completed : undefined} style={{ color: theme.palette.text.primary }}>
                {item.text}
              </Typography>
            </div>
          ))}
          <Typography variant="body2" color="textSecondary">
            Created: {new Date(note.createdDate).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </Typography>
        </div>
        <div>
        <IconButton edge="end" aria-label="update" onClick={(event) => { event.stopPropagation(); handleOpen(note, true); }}>Update</IconButton>
        <IconButton edge="end" aria-label="delete" onClick={(event) => { event.stopPropagation(); handleDeleteNote(note.id); }}>
          <DeleteIcon />
        </IconButton>
        </div>
      </div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">{note.title}</h2>
            <p id="transition-modal-description">{note.content}</p>
          </div>
        </Fade>
      </Modal>
    </ThemeProvider>
  );
};

export default NoteItem;
