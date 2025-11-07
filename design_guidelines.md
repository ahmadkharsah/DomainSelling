# Design Guidelines: Domain Sale Landing Page

## Design Approach
**Minimalist Philosophy**: Clean, focused design with maximum impact through restraint. Every element serves a clear purpose. No decorative elements or unnecessary complexity.

## Color System (User-Specified)
- **Background**: #0C2B4E (deep navy blue, solid throughout)
- **Text/Content**: #F4F4F4 (off-white for optimal readability)
- **Accent/Interactive**: #1D546C (teal-blue for buttons, form borders, focus states)
- **Validation States**: 
  - Error: #EF4444 (red for validation errors)
  - Success: #10B981 (green for confirmation message)

## Typography
- **Primary Font**: 'Inter' or 'Manrope' from Google Fonts
- **Hierarchy**:
  - Domain name display: 56-72px, font-weight 700, letter-spacing -0.02em
  - Section headings: 32-40px, font-weight 600
  - Body text: 16-18px, font-weight 400, line-height 1.6
  - Form labels: 14px, font-weight 500
  - Helper text: 13px, font-weight 400
- **Text Alignment**: Center-aligned for hero content, left-aligned for form

## Layout & Spacing System
- **Tailwind Units**: Consistently use 4, 6, 8, 12, 16, 24 spacing units (p-4, mb-8, gap-12, etc.)
- **Container**: max-w-2xl centered for all content (optimized for form-focused experience)
- **Vertical Rhythm**: 
  - Section spacing: py-16 to py-24
  - Component spacing: mb-12 between major elements
  - Form field spacing: mb-6

## Page Structure

### Hero Section (Above Fold)
- **Height**: Natural height based on content, not forced 100vh
- **Domain Display**: 
  - Large, bold typography showcasing the domain name
  - Subtle visual treatment (e.g., gradient text effect using accent color)
  - Tagline beneath: 1-2 sentences on domain value/potential
- **Spacing**: py-20 on desktop, py-12 on mobile

### Value Proposition Section
- **Brief List**: 2-3 key benefits/features of the domain
- **Typography**: Concise bullet points or short paragraphs
- **Spacing**: py-16

### Contact Form Section
- **Layout**: Single column, max-w-lg centered
- **Field Design**:
  - Input backgrounds: Transparent with border-2 border-[#1D546C]
  - Padding: px-4 py-3 for comfortable touch targets
  - Focus state: ring-2 ring-[#1D546C] ring-offset-2 ring-offset-[#0C2B4E]
  - Placeholder text: opacity-50 of #F4F4F4
- **Labels**: Above inputs, mb-2, clear hierarchy
- **Submit Button**: 
  - Full width within form container
  - py-4 for substantial click target
  - Background: #1D546C
  - Hover: brightness-110
  - Font-weight 600, tracking-wide

### Confirmation Message
- **Display**: Replaces form after submission
- **Style**: Centered card with green accent border
- **Content**: Success icon + confirmation text + next steps
- **Spacing**: p-8, generous whitespace

## Component Specifications

### Form Fields
1. **Full Name Input**: Required indicator, text validation
2. **Email Input**: Email format validation with clear error messaging
3. **Offer Amount**: Number input with USD prefix, minimum $500 validation
4. **Message Textarea**: rows="6", generous space for detailed messages
5. **Honeypot Field**: Hidden, for spam filtering (display: none)

### Validation UI
- **Error Messages**: Below fields, text-sm, color #EF4444, slide-down animation
- **Success Indicators**: Subtle checkmark icon in accent color when valid
- **Required Indicators**: Asterisk (*) in accent color next to labels

### Footer
- **Minimal**: Copyright notice or contact alternative
- **Spacing**: py-8, border-top-1 border-[#1D546C] border-opacity-30

## Interaction Design
- **Form Transitions**: Smooth opacity and transform for confirmation message
- **Focus Management**: Clear focus indicators on all interactive elements
- **Loading States**: Simple spinner or text during form submission
- **Error Handling**: Inline validation on blur, summary at form top on submit

## Responsive Behavior
- **Mobile (< 768px)**: 
  - Reduce heading sizes by 30-40%
  - px-6 horizontal padding
  - Single column throughout
- **Desktop**: Maintain centered layout with generous margins

## Accessibility
- **Form Labels**: Explicitly associated with inputs (for attribute)
- **ARIA Labels**: On submit button and validation messages
- **Keyboard Navigation**: Logical tab order, visible focus states
- **Color Contrast**: All text meets WCAG AA standards against #0C2B4E

## Images
**No images required**: This minimalist approach relies on typography and whitespace. The domain name itself is the visual hero element.