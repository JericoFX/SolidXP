import { render } from 'solid-js/web';
import { createSignal, onMount } from 'solid-js';
import { useTheme, applyTheme, type Theme } from './utils/themes';
import {
  Window,
  Button,
  Checkbox,
  Radio,
  TextBox,
  Select,
  Tabs,
  Tab,
  TabContainer,
  ProgressBar,
  Slider,
  TreeView,
  TreeItem,
  StatusBar,
  StatusField
} from './index';

function App() {
  const [checkboxValue, setCheckboxValue] = createSignal(false);
  const [radioValue, setRadioValue] = createSignal('option1');
  const [textValue, setTextValue] = createSignal('');
  const [selectValue, setSelectValue] = createSignal('option1');
  const [progressValue, setProgressValue] = createSignal(50);
  const [sliderValue, setSliderValue] = createSignal(25);
  const [activeTab, setActiveTab] = createSignal('tab1');
  
  const [currentTheme, setTheme] = useTheme();
  
  const handleThemeChange = (theme: Theme) => {
    applyTheme(theme);
  };
  
  onMount(() => {
    // Asegurar que el tema inicial se aplique
    applyTheme(currentTheme());
  });

  return (
    <div class="playground-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <h1 style="color: #0051af; margin: 0;">SolidXP Component Playground</h1>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span>Theme:</span>
          <Select 
            value={currentTheme()}
            onChange={(value) => handleThemeChange(value as Theme)}
          >
            <option value="xp">Windows XP</option>
            <option value="zune">Zune (Dark)</option>
          </Select>
        </div>
      </div>
      
      {/* Window Component */}
      <div class="component-section">
        <h2 class="component-title">Window Component</h2>
        <div class="component-grid">
          <Window title="Sample Window" class="demo-window">
            <p>This is a basic Windows XP window with title bar controls.</p>
            <Button onClick={() => alert('Button clicked!')}>
              Click Me
            </Button>
          </Window>

          <Window 
            title="Dialog Example" 
            minimizable={false} 
            maximizable={false}
            class="demo-window"
          >
            <p>This window has minimize and maximize disabled.</p>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
              <Button>OK</Button>
              <Button>Cancel</Button>
            </div>
          </Window>
        </div>
      </div>

      {/* Button Component */}
      <div class="component-section">
        <h2 class="component-title">Button Components</h2>
        <Window title="Button Examples">
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;">
            <Button>Default Button</Button>
            <Button variant="default-focus">Focused Button</Button>
            <Button disabled>Disabled Button</Button>
            <Button onClick={() => console.log('Clicked!')}>Clickable</Button>
          </div>
        </Window>
      </div>

      {/* Form Components */}
      <div class="component-section">
        <h2 class="component-title">Form Components</h2>
        <Window title="Form Controls">
          <div style="display: flex; flex-direction: column; gap: 15px;">
            
            <Checkbox 
              id="check1"
              checked={checkboxValue()}
              onChange={(checked) => setCheckboxValue(checked)}
            >
              Checkbox Example
            </Checkbox>

            <div style="display: flex; flex-direction: column; gap: 5px;">
              <Radio 
                id="radio1" 
                name="radiogroup" 
                value="option1"
                checked={radioValue() === 'option1'}
                onChange={() => setRadioValue('option1')}
              >
                Option 1
              </Radio>
              <Radio 
                id="radio2" 
                name="radiogroup" 
                value="option2"
                checked={radioValue() === 'option2'}
                onChange={() => setRadioValue('option2')}
              >
                Option 2
              </Radio>
            </div>

            <TextBox 
              id="textbox1"
              value={textValue()}
              placeholder="Type something..."
              onInput={(e) => setTextValue((e.target as HTMLInputElement).value)}
            >
              Text Input:
            </TextBox>

            <Select 
              id="select1"
              value={selectValue()}
              onChange={(value) => setSelectValue(value)}
              placeholder="Choose option:"
            >
              <option value="option1">First Option</option>
              <option value="option2">Second Option</option>
              <option value="option3">Third Option</option>
            </Select>

          </div>
        </Window>
      </div>

      {/* Progress and Slider */}
      <div class="component-section">
        <h2 class="component-title">Progress & Slider Components</h2>
        <Window title="Progress & Sliders">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            
            <div>
              <p>Progress Bar ({progressValue()}%)</p>
              <ProgressBar value={progressValue()} max={100} />
            </div>

            <div>
              <p>Indeterminate Progress</p>
              <ProgressBar indeterminate />
            </div>

            <Slider
              id="slider1"
              value={sliderValue()}
              min={0}
              max={100}
              onChange={(value) => setSliderValue(value)}
            >
              Volume: {sliderValue()}
            </Slider>

            <Button 
              onClick={() => setProgressValue(Math.random() * 100)}
            >
              Random Progress
            </Button>

          </div>
        </Window>
      </div>

      {/* Tabs Component */}
      <div class="component-section">
        <h2 class="component-title">Tabs Component</h2>
        <Window title="Tabbed Interface">
          <TabContainer 
            activeTab={activeTab()}
            onTabChange={setActiveTab}
            tabs={[
              { id: 'tab1', label: 'General', content: <div><p>General settings and configuration.</p><Button>Apply Settings</Button></div> },
              { id: 'tab2', label: 'Advanced', content: <div><p>Advanced options for power users.</p><Checkbox>Enable debug mode</Checkbox></div> },
              { id: 'tab3', label: 'About', content: <div><p>Application information and credits.</p><p>Version 1.0.0</p></div> }
            ]}
          />
        </Window>
      </div>

      {/* TreeView Component */}
      <div class="component-section">
        <h2 class="component-title">TreeView Component</h2>
        <Window title="File Explorer">
          <TreeView>
            <TreeItem label="My Computer" open>
              <TreeItem label="Local Disk (C:)" open>
                <TreeItem label="Program Files">
                  <TreeItem>Internet Explorer</TreeItem>
                  <TreeItem>Windows Media Player</TreeItem>
                </TreeItem>
                <TreeItem label="Windows">
                  <TreeItem>System32</TreeItem>
                  <TreeItem>Temp</TreeItem>
                </TreeItem>
              </TreeItem>
              <TreeItem label="Local Disk (D:)">
                <TreeItem>Data</TreeItem>
                <TreeItem>Backup</TreeItem>
              </TreeItem>
            </TreeItem>
          </TreeView>
        </Window>
      </div>

      {/* Window with Status Bar */}
      <div class="component-section">
        <h2 class="component-title">Window with Status Bar</h2>
        <Window title="Application with Status">
          <p>This is a window with a status bar at the bottom.</p>
          <p>Status: {checkboxValue() ? 'Checked' : 'Unchecked'}</p>
          <p>Slider: {sliderValue()}</p>
          <p>Selected: {selectValue()}</p>
        </Window>
        <StatusBar>
          <StatusField>Ready</StatusField>
          <StatusField>Items: 12</StatusField>
          <StatusField>Windows XP Style</StatusField>
        </StatusBar>
      </div>

    </div>
  );
}

render(() => <App />, document.getElementById('root')!);