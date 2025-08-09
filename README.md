# Dynamic Form Builder for upliance.ai

A comprehensive, production-grade dynamic form builder application built with React, TypeScript, Material UI, Redux, and localStorage. This application allows users to create, configure, preview, and manage dynamic forms with advanced features like derived fields, validation rules, and drag-and-drop reordering.

## 🚀 Features

### Core Functionality
- **Dynamic Form Creation**: Build forms with 7 different field types
- **Advanced Field Configuration**: Labels, validation rules, default values, and more
- **Derived Fields**: Auto-calculated fields based on other form inputs
- **Drag & Drop Reordering**: Intuitive field management
- **Real-time Preview**: See forms exactly as end users would
- **Form Persistence**: Save and manage forms using localStorage
- **Responsive Design**: Works seamlessly across all device sizes

### Field Types Supported
- **Text**: Single-line text input
- **Number**: Numeric input with validation
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection with custom options
- **Radio**: Single selection from multiple options
- **Checkbox**: Boolean toggle input
- **Date**: Date picker with validation

### Validation Rules
- **Required Fields**: Mark fields as mandatory
- **Length Validation**: Min/max character limits
- **Email Format**: Email address validation
- **Password Rules**: Custom password requirements (min 8 chars, must contain number)

### Derived Fields
- **Age Calculation**: Automatically calculate age from date of birth
- **Sum Operations**: Add numeric values from multiple fields
- **Text Concatenation**: Combine text from multiple fields
- **Custom Logic**: JavaScript-based custom calculations

## 🛠 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **UI Library**: Material UI (MUI) v5
- **Drag & Drop**: @hello-pangea/dnd
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Material UI

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Layout.tsx       # Main application layout
│   ├── FieldEditor.tsx  # Field configuration dialog
│   └── FormRenderer.tsx # Form display component
├── pages/               # Route components
│   ├── HomePage.tsx     # Landing page
│   ├── FormBuilderPage.tsx  # Form creation interface
│   ├── FormPreviewPage.tsx  # Form preview interface
│   └── MyFormsPage.tsx  # Saved forms management
├── store/               # Redux store configuration
│   ├── index.ts         # Store setup
│   └── slices/          # Redux slices
│       ├── formBuilderSlice.ts
│       └── savedFormsSlice.ts
├── types/               # TypeScript type definitions
│   └── form.ts          # Form-related types
├── utils/               # Utility functions
│   ├── localStorage.ts  # localStorage operations
│   ├── validation.ts    # Form validation logic
│   └── derivedFields.ts # Derived field calculations
└── App.tsx              # Main application component
```

## 🚦 Routes

### `/` - Home Page
- Welcome screen with feature overview
- Navigation to main application sections
- Quick access to form creation

### `/create` - Form Builder
- **Add Fields**: Choose from 7 different field types
- **Configure Fields**: Set labels, validation rules, default values
- **Field Options**: Add custom options for select/radio fields
- **Validation Rules**: Configure required fields, length limits, format validation
- **Derived Fields**: Set up auto-calculated fields with parent field dependencies
- **Drag & Drop**: Reorder fields with intuitive drag-and-drop interface
- **Save Forms**: Persist form configurations to localStorage

### `/preview` - Form Preview
- **Interactive Preview**: Test forms as end users would see them
- **Real-time Validation**: See validation errors as you type
- **Derived Field Updates**: Watch calculated fields update automatically
- **Form Submission**: Test complete form submission flow
- **Reset Functionality**: Clear form data and start over

### `/myforms` - Form Management
- **Form Library**: View all saved forms with metadata
- **Form Actions**: Edit, preview, or delete existing forms
- **Creation Dates**: Track when forms were created and last modified
- **Quick Access**: One-click navigation to edit or preview modes

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dynamic-form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 💾 Data Persistence

The application uses localStorage to persist form configurations:

- **Form Schemas**: Complete form structure and field configurations
- **Metadata**: Creation dates, last modified timestamps, form names
- **No User Data**: Only form templates are saved, not user input values

### Storage Structure
```typescript
interface FormSchema {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}
```

## 🎯 Key Features Deep Dive

### Field Configuration
Each field can be extensively configured:
- **Basic Properties**: Label, type, required status
- **Default Values**: Pre-populate fields with default data
- **Validation Rules**: Multiple validation rules per field
- **Custom Options**: For select and radio fields
- **Derived Logic**: Parent field dependencies and calculation methods

### Validation System
Comprehensive validation with real-time feedback:
- **Client-side Validation**: Immediate feedback without server calls
- **Multiple Rules**: Combine different validation rules per field
- **Custom Messages**: Clear, user-friendly error messages
- **Form-level Validation**: Overall form validity checking

### Derived Fields
Advanced calculated fields:
- **Age Calculation**: Automatically calculate age from date of birth
- **Mathematical Operations**: Sum numeric values from multiple fields
- **String Operations**: Concatenate text from various inputs
- **Custom JavaScript**: Write custom calculation logic

### State Management
Redux-based state management:
- **Predictable Updates**: All state changes through Redux actions
- **Time Travel Debugging**: Full Redux DevTools support
- **Modular Slices**: Separate concerns with Redux Toolkit slices
- **Type Safety**: Full TypeScript integration

## 🧪 Usage Examples

### Creating a Contact Form
1. Navigate to `/create`
2. Add fields: Name (text), Email (text with email validation), Message (textarea)
3. Set Name and Email as required
4. Save the form as "Contact Form"

### Building a Registration Form with Age Calculation
1. Add fields: First Name, Last Name, Date of Birth, Age
2. Configure Age as a derived field
3. Set Date of Birth as parent field with "age" computation
4. Age will automatically calculate when DOB is entered

### Creating a Survey with Conditional Logic
1. Add various field types (text, select, radio, checkbox)
2. Use derived fields to create summary calculations
3. Set up validation rules for data quality
4. Preview to test the complete user experience

## 🔍 Technical Decisions

### Why Redux?
- **Predictable State**: Centralized state management for complex form interactions
- **Time Travel**: Excellent debugging capabilities
- **Scalability**: Easy to extend with new features
- **Type Safety**: Full TypeScript integration

### Why Material UI?
- **Professional Design**: Enterprise-ready components
- **Accessibility**: Built-in ARIA support and keyboard navigation
- **Theming**: Consistent design system
- **Mobile Responsive**: Works across all device sizes

### Why localStorage?
- **No Backend Required**: Meets project requirements
- **Instant Persistence**: No network latency
- **Offline Capability**: Works without internet connection
- **Simple Implementation**: Easy to understand and maintain

## 🐛 Known Limitations

- **Storage Limit**: localStorage has size limitations (~5-10MB)
- **Single Device**: Data doesn't sync across devices
- **No Collaboration**: Single-user application
- **Browser Dependency**: Data tied to specific browser

## 🚀 Future Enhancements

- **Export/Import**: JSON export/import functionality
- **Form Templates**: Pre-built form templates
- **Advanced Validation**: Regex-based custom validation
- **Conditional Fields**: Show/hide fields based on other field values
- **Multi-step Forms**: Wizard-style form creation
- **Form Analytics**: Usage statistics and completion rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **upliance.ai** for the project requirements
- **Material UI** team for the excellent component library
- **Redux Toolkit** for simplified state management
- **React** team for the amazing framework

---

Built with ❤️ for upliance.ai using React, TypeScript, Material UI, and Redux.