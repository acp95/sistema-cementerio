import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        CheckboxModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    loginForm: FormGroup;
    loading = signal(false);
    errorMessage = signal<string | null>(null);
    shakeCard = signal(false);

    constructor() {
        this.loginForm = this.fb.group({
            usernameOrEmail: ['', [Validators.required]],
            password: ['admin123', [Validators.required, Validators.minLength(6)]],
            rememberMe: [false]
        });

        // Si ya está autenticado, redirigir al dashboard
        if (this.authService.hasToken()) {
            this.router.navigate(['/dashboard']);
        }
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.errorMessage.set('Por favor complete todos los campos correctamente');
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        const { usernameOrEmail, password } = this.loginForm.value;

        // Enviamos el valor como 'username' que es lo que el backend usará como identifier
        this.authService.login({ username: usernameOrEmail, password }).subscribe({
            next: () => {
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
                this.router.navigate([returnUrl]);
            },
            error: (error) => {
                console.error('Error de login:', error);
                this.loading.set(false);

                const message = error.error?.message || 'Credenciales inválidas. Por favor intente nuevamente.';
                this.errorMessage.set(message);

                // Activar animación shake
                this.shakeCard.set(true);
                setTimeout(() => this.shakeCard.set(false), 500);
            }
        });
    }

    get usernameControl() {
        return this.loginForm.get('usernameOrEmail');
    }

    get passwordControl() {
        return this.loginForm.get('password');
    }
}
