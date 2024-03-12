import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            HomeAdminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CKFrontend';
}
