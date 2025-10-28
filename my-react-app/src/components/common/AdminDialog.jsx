import React from 'react';

const AdminDialog = ({ open, title, children, onConfirm, onCancel, confirmText = 'موافق', cancelText = 'إلغاء', showCancel = true }) => {
  if (!open) return null;

  return (
    <div className="admin-dialog-overlay" role="dialog" aria-modal="true">
      <div className="admin-dialog">
        {title && <h3 className="admin-dialog-title">{title}</h3>}
        <div className="admin-dialog-content">{children}</div>
        <div className="admin-dialog-actions">
          {showCancel && (
            <button onClick={onCancel} className="btn btn-secondary">
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm} className="btn btn-primary">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDialog;
