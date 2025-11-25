import '../styles/AddButton.css';

const AddButton = ({ onClick }) => {
  return (
    <button className="add-button" onClick={onClick} title="Add Song">
      +
    </button>
  );
};

export default AddButton;
