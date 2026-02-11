# TODO: Improve Print Layout for PatientDetail Component

## Tasks
- [x] Add print-specific CSS styles to PatientDetail.tsx
  - Hide back button and print button on print
  - Convert layout to single column for readability
  - Ensure X-ray image is included and properly sized
  - Use clean typography and spacing for print
- [ ] Test the print layout to verify simplicity and readability
- [x] Fix print functionality for Android WebView using Capacitor printer plugin
  - Install cordova-plugin-printer plugin
  - Update PatientDetail.tsx to use cordova printer plugin instead of window.print()
  - Sync Capacitor after installation

## Notes
- Changes only affect the PatientDetail.tsx component
- No new dependencies required
- Print layout will use @media print CSS rules
- For Android, using Capacitor community printer plugin to enable printing
