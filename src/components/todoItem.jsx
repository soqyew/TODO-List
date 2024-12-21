import React from 'react';
import editIcon from './edit-icon.png';
import deleteIcon from './delete-icon.png';

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isEditing: false,
      title: props.item.title,
      description: props.item.description,
    };
  }

  handleEdit = () => {
    this.setState({ isEditing: true });
  };

  handleSave = () => {
    const { title, description } = this.state;
    const { item, onEdit } = this.props;

    onEdit(item.id, title, description); 
    this.setState({ isEditing: false });
  };

  getUrgencyText(urgency) {
    switch (urgency) {
      case 'urgent':
        return 'Срочно';
      case 'medium':
        return 'Средне';
      case 'not urgent':
        return 'Не срочно';
      default:
        return 'Неизвестно';
    }
  }

  getUrgencyColor(urgency) {
    switch (urgency) {
      case 'urgent':
        return 'red';
      case 'medium':
        return 'orange';
      case 'not urgent':
        return 'green';
      default:
        return 'black';
    }
  }

  render() {
    const { item, onToggle, onDelete } = this.props;
    const { isHovered, isEditing, title, description } = this.state;

    const urgencyText = this.getUrgencyText(item.urgency);
    const urgencyColor = this.getUrgencyColor(item.urgency);

    return (
      <div 
        className="todo-item" 
        onMouseEnter={() => this.setState({ isHovered: true })} 
        onMouseLeave={() => this.setState({ isHovered: false })}
      >
        <input 
          type="checkbox" 
          checked={item.completed} 
          onChange={() => onToggle(item.id)} 
        />
        <div className="todo-details">
          {isEditing ? (
            <>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => this.setState({ title: e.target.value })} 
              />
              <textarea 
                value={description} 
                onChange={(e) => this.setState({ description: e.target.value })} 
              />
              <button onClick={this.handleSave}>Сохранить</button>
            </>
          ) : (
            <>
              <span className={item.completed ? 'completed' : ''}>
                {item.title} 
                <span style={{ marginLeft: '10px', color: urgencyColor }}>({urgencyText})</span> 
              </span>
              <p className="description">{description}</p>
            </>
          )}
        </div>
        <span className="timestamp">{item.timestamp}</span>
        {isHovered && !isEditing && (
          <div className="action-buttons">
            <button onClick={this.handleEdit}>
              <img src={editIcon} alt="Редактировать" />
            </button>
            <button className="delete-btn" onClick={() => onDelete(item.id)}>
              <img src={deleteIcon} alt="Удалить" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default TodoItem;