import { useEffect } from 'react';
import ProgressBar from './ProgressBar';
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [onConfirm]);
  /* When we pass the function or object to the React dependencies you have to use to another Hook Provided 
  via react useCallback Hook TO Prevent infinite Loop */
  return (
    <div id="delete-confirmation">
      <h2>Are You Sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
     <ProgressBar/>
    </div>
  );
}
