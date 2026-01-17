export interface SpeedSettings {
  earthOrbitSpeed: number;
  moonOrbitSpeed: number;
  earthRotationSpeed: number;
  moonRotationSpeed: number;
  timeScale: number;
}

const REALISTIC_BASE: SpeedSettings = {
  earthOrbitSpeed: 0.001,
  moonOrbitSpeed: 0.013,
  earthRotationSpeed: 0.01,
  moonRotationSpeed: 0.013,
  timeScale: 1,
};

const FAST_PRESET: SpeedSettings = {
  earthOrbitSpeed: 0.005,
  moonOrbitSpeed: 0.05,
  earthRotationSpeed: 0.05,
  moonRotationSpeed: 0.05,
  timeScale: 2,
};

const DEMO_PRESET: SpeedSettings = {
  earthOrbitSpeed: 0.02,
  moonOrbitSpeed: 0.2,
  earthRotationSpeed: 0.1,
  moonRotationSpeed: 0.1,
  timeScale: 1,
};

export class SpeedController {
  private settings: SpeedSettings;
  private onChangeCallbacks: ((settings: SpeedSettings) => void)[] = [];
  private onCenterCallbacks: (() => void)[] = [];

  constructor() {
    this.settings = { ...REALISTIC_BASE };
    this.setupEventListeners();
    this.updateSliders();
  }

  private setupEventListeners(): void {
    const toggleBtn = document.getElementById('toggle-panel');
    const panel = document.querySelector('.speed-panel') as HTMLElement;

    toggleBtn?.addEventListener('click', () => {
      panel.classList.toggle('collapsed');
      toggleBtn.textContent = panel.classList.contains('collapsed') ? '+' : '−';
    });

    const sliderIds: (keyof SpeedSettings)[] = [
      'timeScale',
      'earthOrbitSpeed',
      'moonOrbitSpeed',
      'earthRotationSpeed',
      'moonRotationSpeed',
    ];

    sliderIds.forEach((id) => {
      const slider = document.getElementById(id) as HTMLInputElement;
      const valueSpan = document.getElementById(`${id}-value`);

      slider?.addEventListener('input', () => {
        const value = parseFloat(slider.value);
        this.settings[id] = value;

        if (valueSpan) {
          valueSpan.textContent = id === 'timeScale' ? `${value}x` : value.toFixed(3);
        }

        this.notifyChange();
      });
    });

    document.getElementById('reset-speeds')?.addEventListener('click', () => {
      this.settings = { ...REALISTIC_BASE };
      this.updateSliders();
      this.notifyChange();
    });

    document.querySelectorAll('.preset-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const preset = target.dataset.preset;
        if (preset === 'realistic') this.settings = { ...REALISTIC_BASE };
        if (preset === 'fast') this.settings = { ...FAST_PRESET };
        if (preset === 'demo') this.settings = { ...DEMO_PRESET };
        this.updateSliders();
        this.notifyChange();
      });
    });

    document.getElementById('center-system')?.addEventListener('click', () => {
      this.onCenterCallbacks.forEach((cb) => cb());
    });
  }

  private updateSliders(): void {
    (Object.keys(this.settings) as (keyof SpeedSettings)[]).forEach((key) => {
      const slider = document.getElementById(key) as HTMLInputElement;
      const valueSpan = document.getElementById(`${key}-value`);

      if (slider) {
        slider.value = String(this.settings[key]);
      }
      if (valueSpan) {
        valueSpan.textContent = key === 'timeScale' ? `${this.settings[key]}x` : this.settings[key].toFixed(3);
      }
    });
  }

  private notifyChange(): void {
    this.onChangeCallbacks.forEach((cb) => cb(this.settings));
  }

  public onChange(callback: (settings: SpeedSettings) => void): void {
    this.onChangeCallbacks.push(callback);
  }

  public onCenter(callback: () => void): void {
    this.onCenterCallbacks.push(callback);
  }

  public getSettings(): SpeedSettings {
    return this.settings;
  }

  public getEffectiveSpeed(key: keyof Omit<SpeedSettings, 'timeScale'>): number {
    return this.settings[key] * this.settings.timeScale;
  }
}
