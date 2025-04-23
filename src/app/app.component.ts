import { Component }    from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header>
      
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .header { padding: 1rem; background: #1e1e1e; color: white; }
    .nav a { margin-right: 1rem; text-decoration: none; color: inherit; }
    .nav a:hover { text-decoration: underline; }
    .container { padding: 1rem; }
  `]
})
export class AppComponent {}
