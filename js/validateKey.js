async function validateKey() {
  const keyInput = document.getElementById('license-key').value;  // Input field where key is entered

  if (!keyInput) {
    alert('Please enter a license key');
    return;
  }

  try {
    // Fetch the keys JSON file from Neocities
    const response = await fetch('https://imoaproductions.neocities.org/Rules/license-key.json');
    if (!response.ok) {
      alert('Failed to fetch license keys!');
      return;
    }
    const data = await response.json();

    // Check if the entered key exists in the keys array
    if (data.keys.includes(keyInput)) {
      // Key is valid, set a flag in localStorage and redirect
      localStorage.setItem('license-validated', 'true');
      window.location.href = 'index.html';  // Redirect to the main page
    } else {
      // Invalid key, show an error
      alert('Invalid License Key!');
    }
  } catch (error) {
    console.error('Error fetching the keys:', error);
    alert('Error validating the key. Please try again later.');
  }
}

// Event listener for the form submit
document.getElementById('key-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent form from submitting traditionally
  validateKey();
});
