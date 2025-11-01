# Single Dynamic Form with Conditional Logic**

### **Advantages:**
- **Maintainability**: One form component to update
- **Consistency**: Unified user experience
- **Scalability**: Easy to add new categories
- **Code Reusability**: Common fields handled once

### **Implementation Approach:**

```javascript
// Field configuration with conditional rules
const FORM_CONFIG = {
  // Universal fields (always shown)
  universal: ['title', 'description', 'location', 'contactInfo', 'images'],
  
  // Conditional fields (show based on rules)
  conditional: {
    price: {
      showFor: 'ALL',
      hideFor: ['Jobs', 'Notices', 'Free']
    },
    condition: {
      showFor: 'PHYSICAL_GOODS', // Electronics, Vehicles, Fashion, etc.
      hideFor: ['Services', 'Events', 'Jobs', 'Notices', 'Property']
    },
    // Category-specific fields
    vehicleFields: {
      showFor: ['Cars & Trucks', 'Motorcycles', 'Boats & Marine', 'RVs & Campers']
    },
    propertyFields: {
      showFor: ['Houses for Sale', 'Apartments for Rent', 'Commercial Property', 'Vacation Rentals']
    },
    eventFields: {
      showFor: ['Events & Shows', 'Tickets']
    }
  }
};
```

### **Field Groups by Category Type:**

**1. Physical Products** (Electronics, Fashion, Sports, etc.)
- Condition field
- Brand/Model
- Specifications

**2. Vehicles** (Cars, Motorcycles, etc.)
- Make, Model, Year
- Mileage, Fuel Type
- Vehicle-specific details

**3. Property** (Houses, Apartments, etc.)
- Property Type
- Bedrooms, Bathrooms
- Square Footage

**4. Services & Jobs**
- Service/Job Type
- Experience Level
- Availability

**5. Events & Tickets**
- Date, Time, Venue
- Event Type

**6. Digital Products**
- Digital Format
- File Size/Type

**7. Pets & Animals**
- Pet Type, Breed, Age
- Vaccination status

### **Form Logic:**
```javascript
const getFieldsForCategory = (category) => {
  const fields = [...universalFields];
  
  // Add conditional fields based on category
  if (shouldShowPrice(category)) fields.push(priceFields);
  if (shouldShowCondition(category)) fields.push(conditionField);
  if (isVehicleCategory(category)) fields.push(...vehicleFields);
  if (isPropertyCategory(category)) fields.push(...propertyFields);
  // ... etc for other categories
  
  return fields;
};
```

