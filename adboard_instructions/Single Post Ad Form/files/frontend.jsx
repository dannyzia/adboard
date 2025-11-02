limport React, { useState, useEffect } from 'react';

// This is a helper component to render form fields dynamically
const FormField = ({ field, value, onChange, onCheckboxChange }) => {
  const { name, label, type, options } = field;

  if (type === 'select') {
    return (
      <div>
        <label>{label}: </label>
        <select name={name} value={value || ''} onChange={onChange}>
          <option value="">{`Select ${label}`}</option>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div>
        <label>{label}: </label>
        <textarea name={name} placeholder={label} value={value || ''} onChange={onChange} />
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div>
        <label>{label}: </label>
        {options?.map(opt => (
          <label key={opt}>
            <input
              type="checkbox"
              name={name}
              value={opt}
              checked={(value || []).includes(opt)}
              onChange={onCheckboxChange}
            />
            {opt}
          </label>
        ))}
      </div>
    );
  }

  // Default to text, number, date, etc.
  return (
    <div>
      <label>{label}: </label>
      <input
        type={type}
        name={name}
        placeholder={label}
        value={field.value || value || ''}
        readOnly={field.readOnly}
        onChange={onChange}
      />
    </div>
  );
};


// --- The Main Form Component ---
const DynamicForm = () => {
  // State for the config fetched from backend
  const [formConfig, setFormConfig] = useState({ categories: [], specificFields: {} });
  const [loading, setLoading] = useState(true);

  // State for the form data
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // 1. Fetch config from backend when component mounts
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Ensure you're using the correct URL for your backend
        const response = await fetch('http://localhost:5000/api/form-config'); 
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const config = await response.json();
        setFormConfig(config);
      } catch (error) {
        console.error("Failed to load form configuration:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, []); // Empty array means this runs once on mount

  // 2. Generic handler for all text/select/radio inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Handler for checkbox groups
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => {
      const currentValues = prev[name] || [];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(item => item !== value) };
      }
    });
  };

  // 4. Handler for file input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // 5. Handler for category change (special case)
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    // Reset form data, but keep the category
    setFormData({ category: category });
  };

  // 6. Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use FormData to send text and files
    const data = new FormData();
    
    // Append all text fields from state
    for (const key in formData) {
      // Handle array values from checkboxes
      if (Array.isArray(formData[key])) {
        formData[key].forEach(value => {
          data.append(`${key}[]`, value); // Send as an array
        });
      } else {
        data.append(key, formData[key]);
      }
    }
    
    // Append the image file
    if (imageFile) {
      data.append('image', imageFile);
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/submit-ad', {
        method: 'POST',
        body: data, // FormData sets its own Content-Type header
      });
      
      const result = await response.text();
      alert(result); // Show "Ad saved successfully!"
      // Optionally reset form
      setFormData({});
      setImageFile(null);
      setSelectedCategory('');

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error: Could not save ad.');
    }
  };

  // Show loading message while fetching config
  if (loading) {
    return <div>Loading form...</div>;
  }

  // Render the form
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px', margin: 'auto' }}>
      
      <h3>Post Your Ad</h3>

      {/* --- Category (drives the form) --- */}
      <div>
        <label>Category: </label>
        <select value={selectedCategory} onChange={handleCategoryChange} required>
          <option value="">Select Category</option>
          {formConfig.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      
      {/* --- Render fields only if a category is selected --- */}
      {selectedCategory && (
        <>
          {/* --- Default Fields --- */}
          <hr />
          <h4>Ad Details</h4>
          <FormField field={{ name: 'title', label: 'Title', type: 'text' }} value={formData.title} onChange={handleChange} />
          <FormField field={{ name: 'description', label: 'Description', type: 'textarea' }} value={formData.description} onChange={handleChange} />
          <div>
            <label>Image: </label>
            <input type="file" name="image" onChange={handleFileChange} />
          </div>

          {/* --- Dynamic/Specific Fields --- */}
          <hr />
          <h4>Category Specifics</h4>
          {formConfig.specificFields[selectedCategory]?.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
              onCheckboxChange={handleCheckboxChange}
            />
          ))}
          
          {/* --- Location & Contact Fields --- */}
          <hr />
          <h4>Location & Contact</h4>
          <FormField field={{ name: 'country', label: 'Country', type: 'text' }} value={formData.country} onChange={handleChange} />
          <FormField field={{ name: 'state', label: 'State', type: 'text' }} value={formData.state} onChange={handleChange} />
          <FormField field={{ name: 'city', label: 'City', type: 'text' }} value={formData.city} onChange={handleChange} />
          <FormField field={{ name: 'contactEmail', label: 'Contact Email', type: 'email' }} value={formData.contactEmail} onChange={handleChange} />
          <FormField field={{ name: 'contactPhone', label: 'Contact Phone', type: 'tel' }} value={formData.contactPhone} onChange={handleChange} />
          <FormField 
            field={{ name: 'adDuration', label: 'Ad Duration', type: 'select', options: ['7 Days', '30 Days', '90 Days'] }} 
            value={formData.adDuration} 
            onChange={handleChange} 
          />

          <button type="submit">Submit Ad</button>
        </>
      )}
    </form>
  );
};

export default DynamicForm;