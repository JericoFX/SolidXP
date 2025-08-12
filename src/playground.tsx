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
  StatusField,
  Modal,
  Table,
} from './index';

function App() {
  const [checkboxValue, setCheckboxValue] = createSignal(false);
  const [radioValue, setRadioValue] = createSignal('option1');
  const [textValue, setTextValue] = createSignal('');
  const [selectValue, setSelectValue] = createSignal('option1');
  const [progressValue, setProgressValue] = createSignal(50);
  const [sliderValue, setSliderValue] = createSignal(25);
  const [activeTab, setActiveTab] = createSignal('tab1');
  const [showModal, setShowModal] = createSignal(false);

  // Sample data for table
  const tableData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'User',
      status: 'Inactive',
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'Moderator',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      role: 'User',
      status: 'Pending',
    },
  ];

  // Large dataset for sticky header demo
  const largeTableData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['Admin', 'User', 'Moderator'][i % 3],
    status: ['Active', 'Inactive', 'Pending'][i % 3],
    department: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'][i % 5],
    joinDate: new Date(
      2020 + (i % 4),
      i % 12,
      (i % 28) + 1
    ).toLocaleDateString(),
    salary: `$${(30000 + i * 1000).toLocaleString()}`,
  }));

  const tableColumns = [
    { key: 'id', header: 'ID', width: '60px', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row: any) => (
        <span
          style={{
            padding: '2px 6px',
            'border-radius': '3px',
            'font-size': '10px',
            background:
              row.status === 'Active'
                ? '#90EE90'
                : row.status === 'Inactive'
                ? '#FFB6C1'
                : '#FFFFE0',
            color: '#000',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const largeTableColumns = [
    { key: 'id', header: 'ID', width: '50px', sortable: true },
    { key: 'name', header: 'Name', width: '120px', sortable: true },
    { key: 'email', header: 'Email', width: '180px', sortable: true },
    { key: 'role', header: 'Role', width: '100px', sortable: true },
    { key: 'department', header: 'Department', width: '120px', sortable: true },
    { key: 'joinDate', header: 'Join Date', width: '100px', sortable: true },
    { key: 'salary', header: 'Salary', width: '100px', sortable: true },
    {
      key: 'status',
      header: 'Status',
      width: '80px',
      sortable: true,
      render: (row: any) => (
        <span
          style={{
            padding: '2px 6px',
            'border-radius': '3px',
            'font-size': '10px',
            background:
              row.status === 'Active'
                ? '#90EE90'
                : row.status === 'Inactive'
                ? '#FFB6C1'
                : '#FFFFE0',
            color: '#000',
          }}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const [currentTheme, setTheme] = useTheme();

  const handleThemeChange = (theme: Theme) => {
    applyTheme(theme);
  };

  onMount(() => {
    // Asegurar que el tema inicial se aplique
    applyTheme(currentTheme());
  });

  return (
    <div class='playground-container'>
      <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;'>
        <h1 style='color: #0051af; margin: 0;'>SolidXP Component Playground</h1>
        <div style='display: flex; gap: 10px; align-items: center;'>
          <span>Theme:</span>
          <Select
            value={currentTheme()}
            onChange={(value) => handleThemeChange(value as Theme)}
          >
            <option value='xp'>Windows XP</option>
            <option value='zune'>Zune</option>
            <option value='royale'>Royale Dark</option>
          </Select>
        </div>
      </div>

      {/* Window Component */}
      <div class='component-section'>
        <h2 class='component-title'>Window Component</h2>
        <div class='component-grid'>
          <Window title='Sample Window' class='demo-window'>
            <p>This is a basic Windows XP window with title bar controls.</p>
            <Button onClick={() => alert('Button clicked!')}>Click Me</Button>
          </Window>

          <Window
            title='Dialog Example'
            minimizable={false}
            maximizable={false}
            class='demo-window'
          >
            <p>This window has minimize and maximize disabled.</p>
            <div style='display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;'>
              <Button>OK</Button>
              <Button>Cancel</Button>
            </div>
          </Window>
        </div>
      </div>

      {/* Button Component */}
      <div class='component-section'>
        <h2 class='component-title'>Button Components</h2>
        <Window title='Button Examples'>
          <div style='display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px;'>
            <Button>Default Button</Button>
            <Button variant='default-focus'>Focused Button</Button>
            <Button disabled>Disabled Button</Button>
            <Button onClick={() => console.log('Clicked!')}>Clickable</Button>
          </div>
        </Window>
      </div>

      {/* Form Components */}
      <div class='component-section'>
        <h2 class='component-title'>Form Components</h2>
        <Window title='Form Controls'>
          <div style='display: flex; flex-direction: column; gap: 15px;'>
            <Checkbox
              id='check1'
              checked={checkboxValue()}
              onChange={(checked) => setCheckboxValue(checked)}
            >
              Checkbox Example
            </Checkbox>

            <div style='display: flex; flex-direction: column; gap: 5px;'>
              <Radio
                id='radio1'
                name='radiogroup'
                value='option1'
                checked={radioValue() === 'option1'}
                onChange={() => setRadioValue('option1')}
              >
                Option 1
              </Radio>
              <Radio
                id='radio2'
                name='radiogroup'
                value='option2'
                checked={radioValue() === 'option2'}
                onChange={() => setRadioValue('option2')}
              >
                Option 2
              </Radio>
            </div>

            <TextBox
              id='textbox1'
              value={textValue()}
              placeholder='Type something...'
              onInput={(e) =>
                setTextValue((e.target as HTMLInputElement).value)
              }
            >
              Text Input:
            </TextBox>

            <Select
              id='select1'
              value={selectValue()}
              onChange={(value) => setSelectValue(value)}
              placeholder='Choose option:'
            >
              <option value='option1'>First Option</option>
              <option value='option2'>Second Option</option>
              <option value='option3'>Third Option</option>
            </Select>
          </div>
        </Window>
      </div>

      {/* Progress and Slider */}
      <div class='component-section'>
        <h2 class='component-title'>Progress & Slider Components</h2>
        <Window title='Progress & Sliders'>
          <div style='display: flex; flex-direction: column; gap: 20px;'>
            <div>
              <p>Progress Bar ({progressValue()}%)</p>
              <ProgressBar value={progressValue()} max={100} />
            </div>

            <div>
              <p>Indeterminate Progress</p>
              <ProgressBar indeterminate />
            </div>

            <Slider
              id='slider1'
              value={sliderValue()}
              min={0}
              max={100}
              onChange={(value) => setSliderValue(value)}
            >
              Volume: {sliderValue()}
            </Slider>

            <Button onClick={() => setProgressValue(Math.random() * 100)}>
              Random Progress
            </Button>
          </div>
        </Window>
      </div>

      {/* Tabs Component */}
      <div class='component-section'>
        <h2 class='component-title'>Tabs Component</h2>
        <Window title='Tabbed Interface'>
          <TabContainer
            activeTab={activeTab()}
            onTabChange={setActiveTab}
            tabs={[
              {
                id: 'tab1',
                label: 'General',
                content: (
                  <div>
                    <p>General settings and configuration.</p>
                    <Button>Apply Settings</Button>
                  </div>
                ),
              },
              {
                id: 'tab2',
                label: 'Advanced',
                content: (
                  <div>
                    <p>Advanced options for power users.</p>
                    <Checkbox>Enable debug mode</Checkbox>
                  </div>
                ),
              },
              {
                id: 'tab3',
                label: 'About',
                content: (
                  <div>
                    <p>Application information and credits.</p>
                    <p>Version 1.0.0</p>
                  </div>
                ),
              },
            ]}
          />
        </Window>
      </div>

      {/* TreeView Component */}
      <div class='component-section'>
        <h2 class='component-title'>TreeView Component</h2>
        <Window title='File Explorer'>
          <TreeView>
            <TreeItem label='My Computer' open>
              <TreeItem label='Local Disk (C:)' open>
                <TreeItem label='Program Files'>
                  <TreeItem>Internet Explorer</TreeItem>
                  <TreeItem>Windows Media Player</TreeItem>
                </TreeItem>
                <TreeItem label='Windows'>
                  <TreeItem>System32</TreeItem>
                  <TreeItem>Temp</TreeItem>
                </TreeItem>
              </TreeItem>
              <TreeItem label='Local Disk (D:)'>
                <TreeItem>Data</TreeItem>
                <TreeItem>Backup</TreeItem>
              </TreeItem>
            </TreeItem>
          </TreeView>
        </Window>
      </div>

      {/* Window with Status Bar */}
      <div class='component-section'>
        <h2 class='component-title'>Window with Status Bar</h2>
        <Window
          title='Application with Status'
          statusBar={
            <StatusBar>
              <StatusField>Ready</StatusField>
              <StatusField>
                Status: {checkboxValue() ? 'Checked' : 'Unchecked'}
              </StatusField>
              <StatusField>Slider: {sliderValue()}</StatusField>
              <StatusField>Selected: {selectValue()}</StatusField>
            </StatusBar>
          }
        >
          <p>This is a window with an integrated status bar at the bottom.</p>
          <p>
            The status bar is now part of the window component and updates
            dynamically:
          </p>
          <ul>
            <li>Checkbox state: {checkboxValue() ? 'Checked' : 'Unchecked'}</li>
            <li>Slider value: {sliderValue()}</li>
            <li>Selected option: {selectValue()}</li>
          </ul>
        </Window>
      </div>

      {/* Modal Component */}
      <div class='component-section'>
        <h2 class='component-title'>Modal Component</h2>
        <Window title='Modal Examples'>
          <div style='display: flex; gap: 10px; margin-bottom: 20px;'>
            <Button onClick={() => setShowModal(true)}>Show Modal</Button>
          </div>
          <p>Click the button to display a modal dialog.</p>

          <Modal
            open={showModal()}
            title='Example Modal'
            onClose={() => setShowModal(false)}
            centered
          >
            <div style='padding: 10px;'>
              <p>This is a modal dialog with Windows XP styling!</p>
              <p>You can:</p>
              <ul>
                <li>Click the X button to close</li>
                <li>Press Escape key to close</li>
                <li>Click outside to close</li>
              </ul>
              <div style='margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;'>
                <Button onClick={() => setShowModal(false)}>Close</Button>
                <Button onClick={() => alert('Action performed!')}>
                  Action
                </Button>
              </div>
            </div>
          </Modal>
        </Window>
      </div>

      {/* Table Component */}
      <div class='component-section'>
        <h2 class='component-title'>Table Component</h2>
        <Window
          title='Data Table - Interactive Events'
          statusBar={
            <StatusBar>
              <StatusField>Items: {tableData.length}</StatusField>
              <StatusField>Interactive table</StatusField>
              <StatusField>Click events enabled</StatusField>
            </StatusBar>
          }
        >
          <p style='margin-bottom: 10px; font-size: 10px;'>
            Try: Click rows, double-click rows, click cells, click headers.
            Check console for events.
          </p>
          <Table
            columns={tableColumns}
            data={tableData}
            striped
            hoverable
            sortable
            selectable
            caption='User Management Table with Events'
            onRowClick={(row, index) =>
              console.log('Row clicked:', row, 'at index:', index)
            }
            onRowDoubleClick={(row, index) =>
              console.log('Row double-clicked:', row, 'at index:', index)
            }
            onCellClick={(row, column, value) =>
              console.log('Cell clicked:', { row, column: column.key, value })
            }
            onHeaderClick={(column) =>
              console.log('Header clicked:', column.key)
            }
            onSort={(column, direction) =>
              console.log('Sort:', column, direction)
            }
          />
        </Window>
      </div>

      {/* Progress Bar Examples */}
      <div class='component-section'>
        <h2 class='component-title'>Progress Bar Sizing</h2>
        <Window
          title='Custom Width Progress Bars'
          statusBar={
            <StatusBar>
              <StatusField>Progress examples</StatusField>
              <StatusField>Configurable sizes</StatusField>
              <StatusField>XP authentic blocks</StatusField>
            </StatusBar>
          }
        >
          <div style='display: flex; flex-direction: column; gap: 15px;'>
            <div>
              <p>Small (150px): </p>
              <ProgressBar value={progressValue()} width='150px' />
            </div>
            <div>
              <p>Medium (250px): </p>
              <ProgressBar value={progressValue()} width='250px' />
            </div>
            <div>
              <p>Large (400px): </p>
              <ProgressBar value={80} width='400px' />
            </div>
            <div>
              <p>Custom height (30px): </p>
              <ProgressBar
                value={progressValue()}
                width='300px'
                height='30px'
              />
            </div>
            <div>
              <p>Full width: </p>
              <ProgressBar value={progressValue()} />
            </div>
          </div>
        </Window>
      </div>

      {/* Sticky Header Table Examples */}
      <div class='component-section'>
        <h2 class='component-title'>Fixed Header Tables</h2>
        <Window
          title='Large Dataset with Sticky Header'
          statusBar={
            <StatusBar>
              <StatusField>Records: {largeTableData.length}</StatusField>
              <StatusField>Fixed header enabled</StatusField>
              <StatusField>Scroll to test</StatusField>
            </StatusBar>
          }
        >
          <p style='margin-bottom: 10px; font-size: 10px;'>
            This table has a fixed height with sticky header. Scroll down to see
            the header stay fixed while rows scroll.
          </p>
          <Table
            columns={largeTableColumns}
            data={largeTableData}
            striped
            hoverable
            sortable
            selectable
            stickyHeader
            height='300px'
            width='100%'
            caption='Employee Database - Fixed Header'
            onRowClick={(row, index) =>
              console.log('Large table row clicked:', row, 'at index:', index)
            }
            onCellClick={(row, column, value) =>
              console.log('Large table cell clicked:', {
                row: row.name,
                column: column.key,
                value,
              })
            }
            onSort={(column, direction) =>
              console.log('Large table sort:', column, direction)
            }
          />
        </Window>
      </div>

      {/* Custom Size Tables */}
      <div class='component-section'>
        <h2 class='component-title'>Custom Table Sizes</h2>
        <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 20px;'>
          <Window
            title='Compact Table'
            statusBar={
              <StatusBar>
                <StatusField>Compact: 200x250px</StatusField>
              </StatusBar>
            }
          >
            <Table
              columns={tableColumns.slice(0, 3)} // Solo primeras 3 columnas
              data={tableData}
              hoverable
              sortable
              stickyHeader
              height='200px'
              width='250px'
              size='small'
            />
          </Window>

          <Window
            title='Wide Scrollable Table'
            statusBar={
              <StatusBar>
                <StatusField>Wide: 400x200px</StatusField>
              </StatusBar>
            }
          >
            <Table
              columns={largeTableColumns}
              data={largeTableData.slice(0, 10)}
              striped
              hoverable
              sortable
              stickyHeader
              height='200px'
              width='400px'
            />
          </Window>
        </div>
      </div>
    </div>
  );
}

render(() => <App />, document.getElementById('root')!);
