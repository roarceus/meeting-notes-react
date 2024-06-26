import React, { useState, useEffect, useRef } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, Grid } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import NoteItem from './NoteItem'; // Import NoteItem component
import './../index.css';

type Note = {
  id: number;
  title: string;
  content: string;
  actionItems: ActionItem[];
  createdDate: string;
};

type ActionItem = {
  id: number;
  text: string;
  completed: boolean;
};

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [actionItem, setActionItem] = useState('');
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const actionItemInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  // GET notes from server
  const fetchNotes = () => {
    fetch('http://localhost:3000/meeting-notes')
      .then((res) => res.json())
      .then((data) => {
        const formattedNotes: Note[] = data.map((note: any) => ({
          id: note._id,
          title: note.title,
          content: note.content,
          actionItems: note.actionItems,
          createdDate: note.createdDate
        }));
        setNotes(formattedNotes);
      })
      .catch((error) => {
        console.error('Error fetching notes:', error);
      });
  };

  // open dialog
  const handleOpen = (note: Note | null = null, isUpdate = false) => {
    setOpen(true);
    setIsUpdate(isUpdate);
    setSelectedNote(note);

    if (isUpdate && note) {
      setTitle(note.title);
      setContent(note.content);
      setActionItems(note.actionItems);
    } else {
      setTitle('');
      setContent('');
      setActionItems([]);
    }

    if (!isUpdate && actionItemInputRef.current) {
      actionItemInputRef.current.focus();
    }
  };

  // close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // add action items
  const handleAddActionItem = () => {
    if (actionItem.trim() !== '') {
      const newActionItem: ActionItem = {
        id: Date.now(),
        text: actionItem.trim(),
        completed: false
      };
      setActionItems([...actionItems, newActionItem]);
      setActionItem('');
    }
  };

  // delete action items
  const handleDeleteActionItem = (id: number) => {
    const updatedActionItems = actionItems.filter(item => item.id !== id);
    setActionItems(updatedActionItems);
  };

  // handle checkbox toggle
  const handleCheckboxToggle = (id: number) => {
    const updatedActionItems = actionItems.map(item => {
      if (item.id === id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setActionItems(updatedActionItems);
  };

  // POST note to server
  const handleSubmit = () => {
    const currentDate = new Date().toISOString();
    const newNote: Note = {
      id: selectedNote ? selectedNote.id : notes.length + 1,
      title: title.trim(),
      content: content.trim(),
      actionItems: actionItems,
      createdDate: currentDate
    };

    let url = 'http://localhost:3000/meeting-notes';
    let method = 'POST';
    if (isUpdate && selectedNote) {
      url += `/${selectedNote.id}`;
      method = 'PUT';
    }

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNote)
    })
      .then(response => response.json())
      .then(data => {
        if (isUpdate && selectedNote) {
          const updatedNotes = notes.map(note => {
            if (note.id === selectedNote.id) {
              return newNote;
            }
            return note;
          });
          setNotes(updatedNotes);
        } else {
          setNotes([...notes, newNote]);
        }

        fetchNotes();

        setOpen(false);
      })
      .catch(error => {
        console.error('Error adding/updating note:', error);
      });
  };

  // DELETE note from server
  const handleDeleteNote = (id: number) => {
    fetch(`http://localhost:3000/meeting-notes/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          setNotes(notes.filter(note => note.id !== id));
        } else {
          console.error('Failed to delete note');
        }
      })
      .catch(error => {
        console.error('Error deleting note:', error);
      });
  };

  // Filter notes
  const handleFilter = () => {
    // Construct the filter object
    const filterObject = {
      keyword: keyword,
      startDate: startDate,
      endDate: endDate
    };
  
    // Remove empty values from the filter object
    const filteredFilterObject = Object.fromEntries(
      Object.entries(filterObject).filter(([_, value]) => value !== '')
    );
  
    // Convert the filtered filter object to query parameters
    const queryParams = new URLSearchParams(filteredFilterObject).toString();
    
    const endpoint = `http://localhost:3000/meeting-notes/filter?${queryParams}`;
  
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log('Filtered data:', data); // Add this line for debugging
        if (data && data.length > 0) {
          // Filter the notes based on the keyword
          const filteredNotes = data.filter(note => {
            // Check if the keyword exists in the title, content, or action items
            return (
              note.title.includes(keyword) ||
              note.content.includes(keyword) ||
              note.actionItems.some(action => action.text.includes(keyword))
            );
          }).map(note => ({
            id: note._id,
            title: note.title,
            content: note.content,
            actionItems: note.actionItems,
            createdDate: note.createdDate
          }));
          setNotes(filteredNotes);
          console.log(filteredNotes);
        } else {
          // If no data or empty array, reset notes to an empty array
          setNotes([]);
        }
      })
      .catch((error) => {
        console.error('Error filtering notes:', error);
      });
  };

  // Clear filter
  const handleClearFilter = () => {
    setKeyword('');
    setStartDate('');
    setEndDate('');
    fetchNotes();
  };

  // UI
  return (
    <div style={{ backgroundColor: '#fbf093', fontFamily: 'Roboto', margin: 0, padding: 0 }}>
    <h1 style={{ margin: 0, padding: '20px' }}>Meeting Notes</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Button variant="contained" color="primary" onClick={() => handleOpen(null)}>Add Note</Button>
        <div style={{ marginLeft: '20px' }}>
          <TextField
            label="Keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div style={{ marginLeft: '20px' }}>
          <Button variant="contained" color="primary" onClick={handleFilter}>Filter</Button>
        </div>
        <div style={{ marginLeft: '20px' }}>
          <Button variant="contained" color="secondary" onClick={handleClearFilter}>Clear Filter</Button>
        </div>
      </div>
      <Grid container spacing={3}>
        {notes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <NoteItem
              note={note}
              handleOpen={handleOpen}
              handleDeleteNote={handleDeleteNote}
              handleCheckboxToggle={handleCheckboxToggle}
            />
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{isUpdate ? 'Update Note' : 'Add Note'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <DialogContentText>
            Action Items:
          </DialogContentText>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {actionItems.map((item) => (
              <li key={item.id}>
                <Checkbox
                  checked={item.completed}
                  onChange={() => handleCheckboxToggle(item.id)}
                  color="primary"
                  style={{ display: isUpdate ? 'inline-block' : 'none' }}
                />
                <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>{item.text}</span>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteActionItem(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </li>
            ))}
          </ul>
          <TextField
            inputRef={actionItemInputRef}
            margin="dense"
            label="Action Item"
            type="text"
            fullWidth
            value={actionItem}
            onChange={(e) => setActionItem(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddActionItem();
              }
            }}
          />
          <Button onClick={handleAddActionItem} color="primary">
            Add Action Item
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isUpdate ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  ); 
}

export default Notes;