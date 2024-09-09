import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [ReactiveFormsModule], // Import ReactiveFormsModule
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  passwordForm: FormGroup;
  generatedPassword: string = '';
  passwordStrength: string = '';

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      length: [10],
      includeUppercase: [true],
      includeLowercase: [true],
      includeNumbers: [true],
      includeSymbols: [false]
    });
  }

  // Generate password based on form values
  generatePassword() {
    const formValue = this.passwordForm.value;
    const length = formValue.length;
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let validChars = '';
    if (formValue.includeUppercase) validChars += uppercaseChars;
    if (formValue.includeLowercase) validChars += lowercaseChars;
    if (formValue.includeNumbers) validChars += numberChars;
    if (formValue.includeSymbols) validChars += symbolChars;

    this.generatedPassword = this.generateRandomPassword(length, validChars);
    this.passwordStrength = this.calculateStrength(this.generatedPassword);
  }

  // Helper function to generate random password
  private generateRandomPassword(length: number, validChars: string): string {
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      password += validChars[randomIndex];
    }
    return password;
  }

  // Copy password to clipboard
  copyPassword() {
    navigator.clipboard.writeText(this.generatedPassword);
    alert('Password copied to clipboard');
  }

  // Calculate password strength based on the actual password
  private calculateStrength(password: string): string {
    let strength = 0;
    const lengthCriteria = password.length >= 8;
    const upperCaseCriteria = /[A-Z]/.test(password);
    const lowerCaseCriteria = /[a-z]/.test(password);
    const digitCriteria = /\d/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (lengthCriteria) strength++;
    if (upperCaseCriteria) strength++;
    if (lowerCaseCriteria) strength++;
    if (digitCriteria) strength++;
    if (specialCharCriteria) strength++;

    switch (strength) {
      case 0:
        return 'WEAK';
      case 1:
        return 'FAIR';
      case 2:
        return 'GOOD';
      case 3:
        return 'STRONG';
      case 4:
        return 'VERY STRONG';
      // default:
      //   return 'MEDIUM'; // Default strength level
    }
  }
}
