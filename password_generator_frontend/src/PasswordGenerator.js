import React, { useState } from 'react';
import './PasswordGenerator.css';

// PUBLIC_INTERFACE
/**
 * PasswordGenerator component provides a user interface for generating secure passwords.
 * Users can customize password length and character types, then generate and copy passwords.
 */
function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [error, setError] = useState('');

  // Check if at least one character set is selected
  const isValid = includeLowercase || includeUppercase || includeNumbers || includeSpecial;

  // PUBLIC_INTERFACE
  /**
   * Display a toast notification to the user
   * @param {string} message - The message to display
   * @param {string} type - The type of toast (success or error)
   */
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // PUBLIC_INTERFACE
  /**
   * Generate a password by calling the backend API
   */
  const handleGeneratePassword = async () => {
    if (!isValid) {
      setError('Please select at least one character type');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://vscode-internal-42472-beta.beta01.cloud.kavia.ai:3001/api/generate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length: parseInt(length),
          include_lowercase: includeLowercase,
          include_uppercase: includeUppercase,
          include_numbers: includeNumbers,
          include_special: includeSpecial,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedPassword(data.password);
        showToast('Password generated successfully!', 'success');
      } else {
        setError(data.error || 'Failed to generate password');
        showToast(data.error || 'Failed to generate password', 'error');
      }
    } catch (err) {
      const errorMessage = 'Failed to connect to the server. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Copy the generated password to clipboard
   */
  const handleCopyToClipboard = async () => {
    if (!generatedPassword) return;

    try {
      await navigator.clipboard.writeText(generatedPassword);
      showToast('Password copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy password', 'error');
    }
  };

  return (
    <div className="password-generator-container">
      <div className="password-generator-card">
        <h1 className="title">Secure Password Generator</h1>
        <p className="subtitle">Create strong, random passwords tailored to your needs</p>

        <div className="form-section">
          {/* Password Length Control */}
          <div className="form-group">
            <label htmlFor="length" className="form-label">
              Password Length: <span className="length-value">{length}</span>
            </label>
            <div className="length-control">
              <input
                id="length"
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="slider"
              />
              <input
                type="number"
                min="8"
                max="64"
                value={length}
                onChange={(e) => {
                  const value = Math.min(64, Math.max(8, parseInt(e.target.value) || 8));
                  setLength(value);
                }}
                className="number-input"
              />
            </div>
          </div>

          {/* Character Type Checkboxes */}
          <div className="form-group">
            <label className="form-label">Character Types:</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                />
                <span>Numbers (0-9)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeSpecial}
                  onChange={(e) => setIncludeSpecial(e.target.checked)}
                />
                <span>Special (!@#$%^&*)</span>
              </label>
            </div>
          </div>

          {/* Validation Error */}
          {!isValid && (
            <div className="validation-error">
              Please select at least one character type
            </div>
          )}

          {/* Generate Button */}
          <button
            className="generate-button"
            onClick={handleGeneratePassword}
            disabled={!isValid || loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              'Generate Password'
            )}
          </button>

          {/* Generated Password Display */}
          {generatedPassword && (
            <div className="password-result">
              <label className="form-label">Generated Password:</label>
              <div className="password-display">
                <input
                  type="text"
                  value={generatedPassword}
                  readOnly
                  className="password-input"
                />
                <button
                  className="copy-button"
                  onClick={handleCopyToClipboard}
                  title="Copy to clipboard"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default PasswordGenerator;
