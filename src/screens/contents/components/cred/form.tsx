import React from 'react';

type FormProps = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
};

export default function Form({
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
}: FormProps) {
  
  return (
    <div className='form-container'>
      <h3>Edit User Credentials</h3>
      <div>
        <label>Current Password</label>
        <input
          value={currentPassword}
          type='password'
          placeholder='Current password'
          onChange={(e) => onCurrentPasswordChange(e.target.value)}
        />
        <label>New Password</label>
        <input
          value={newPassword}
          type='password'
          placeholder='New password'
          onChange={(e) => onNewPasswordChange(e.target.value)}
        />
        <label>Confirm New Password</label>
        <input
          value={confirmPassword}
          type='password'
          placeholder='Confirm new password'
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
        />
      </div>
    </div>
  );
}
