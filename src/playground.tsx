import { render } from 'solid-js/web';
import { createSignal, onMount, Show } from 'solid-js';
import { useTheme, applyTheme, type Theme } from './utils/themes';
import {
  Window,
  Button,
  Checkbox,
  Radio,
  TextBox,
  Select,
  TabContainer,
  ProgressBar,
  Slider,
  TreeView,
  TreeItem,
  StatusBar,
  StatusField,
  Modal,
  Table,
  FileExplorer,
  Notepad,
  ImageViewer,
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
  const [currentPath, setCurrentPath] = createSignal('');
  const [explorerViewMode, setExplorerViewMode] = createSignal<'icons' | 'details'>('icons');
  const [notepadValue, setNotepadValue] = createSignal('Welcome to SolidXP Notepad!\n\nThis is a Windows XP styled text editor.\n\nFeatures:\n- Authentic XP styling\n- Line numbers (toggle)\n- Ctrl+S to save\n- Theme support\n\nStart typing to edit this text...');
  const [showLineNumbers, setShowLineNumbers] = createSignal(false);
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);
  const [showModalViewer, setShowModalViewer] = createSignal(false);
  const [modalImageIndex, setModalImageIndex] = createSignal(0);

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

  // Sample file explorer data
  const sampleFiles = () => {
    const basePath = currentPath();
    if (!basePath) {
      // Root level - My Computer
      return [
        { name: 'Documents', type: 'folder' as const, size: undefined, modified: new Date('2023-01-15') },
        { name: 'Pictures', type: 'folder' as const, size: undefined, modified: new Date('2023-01-20') },
        { name: 'Music', type: 'folder' as const, size: undefined, modified: new Date('2023-01-10') },
        { name: 'Downloads', type: 'folder' as const, size: undefined, modified: new Date('2023-01-25') },
        { name: 'Desktop', type: 'folder' as const, size: undefined, modified: new Date('2023-01-12') },
      ];
    } else if (basePath === 'Documents') {
      return [
        { name: 'Resume.docx', type: 'file' as const, size: 125000, modified: new Date('2023-01-15') },
        { name: 'Projects', type: 'folder' as const, size: undefined, modified: new Date('2023-01-18') },
        { name: 'Notes.txt', type: 'file' as const, size: 2500, modified: new Date('2023-01-20') },
        { name: 'Budget.xlsx', type: 'file' as const, size: 45000, modified: new Date('2023-01-22') },
      ];
    } else if (basePath === 'Pictures') {
      return [
        { name: 'Vacation', type: 'folder' as const, size: undefined, modified: new Date('2023-01-20') },
        { name: 'photo1.jpg', type: 'file' as const, size: 2500000, modified: new Date('2023-01-21') },
        { name: 'photo2.png', type: 'file' as const, size: 1800000, modified: new Date('2023-01-21') },
        { name: 'screenshot.png', type: 'file' as const, size: 850000, modified: new Date('2023-01-23') },
      ];
    } else if (basePath === 'Music') {
      return [
        { name: 'Classical', type: 'folder' as const, size: undefined, modified: new Date('2023-01-10') },
        { name: 'Rock', type: 'folder' as const, size: undefined, modified: new Date('2023-01-11') },
        { name: 'song1.mp3', type: 'file' as const, size: 4200000, modified: new Date('2023-01-12') },
        { name: 'song2.wav', type: 'file' as const, size: 8500000, modified: new Date('2023-01-13') },
      ];
    } else if (basePath === 'Documents/Projects') {
      return [
        { name: 'Website', type: 'folder' as const, size: undefined, modified: new Date('2023-01-18') },
        { name: 'App', type: 'folder' as const, size: undefined, modified: new Date('2023-01-19') },
        { name: 'README.md', type: 'file' as const, size: 1500, modified: new Date('2023-01-20') },
      ];
    } else {
      return [
        { name: 'sample.txt', type: 'file' as const, size: 1000, modified: new Date() },
      ];
    }
  };

  // Sample images for ImageViewer
  const sampleImages = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2', 
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5',
    'https://picsum.photos/800/600?random=6',
  ];

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

  const [currentTheme] = useTheme();

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

      {/* FileExplorer Component */}
      <div class='component-section'>
        <h2 class='component-title'>File Explorer Component</h2>
        <Window 
          title='File Explorer - XP Style'
          statusBar={
            <StatusBar>
              <StatusField>Path: {currentPath() || 'My Computer'}</StatusField>
              <StatusField>View: {explorerViewMode()}</StatusField>
              <StatusField>Search enabled - Type to filter</StatusField>
            </StatusBar>
          }
        >
          <div style='display: flex; gap: 10px; margin-bottom: 10px; padding: 5px; border-bottom: 1px solid #c0c0c0;'>
            <Button 
              size='small'
              onClick={() => setExplorerViewMode('icons')}
              variant={explorerViewMode() === 'icons' ? 'default-focus' : 'default'}
            >
              Icons
            </Button>
            <Button 
              size='small'
              onClick={() => setExplorerViewMode('details')}
              variant={explorerViewMode() === 'details' ? 'default-focus' : 'default'}
            >
              Details
            </Button>
          </div>
          <div style='margin-bottom: 10px; padding: 5px; background: #f8f8f8; border: 1px solid #c0c0c0;'>
            <p style='font-size: 11px; margin: 0; color: #666;'>
              Use the search bar above to filter files and folders in the current directory. 
              Search works on file/folder names and updates results in real-time.
            </p>
          </div>
          <FileExplorer
            data={sampleFiles()}
            currentPath={currentPath()}
            viewMode={explorerViewMode()}
            height='350px'
            onNavigate={(path, item) => {
              console.log('Navigating to:', path, item);
              setCurrentPath(path);
            }}
            onFileSelect={(item, selectedItems) => {
              console.log('File selected:', item, selectedItems);
            }}
            onFileOpen={(item) => {
              console.log('File opened:', item);
              alert(`Opening file: ${item.name}`);
            }}
            onSearchChange={(searchTerm, filteredItems) => {
              console.log('Search changed:', searchTerm, 'Filtered items:', filteredItems.length);
            }}
          />
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
            <div>
              <p>100% Progress Test: </p>
              <ProgressBar value={100} />
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

      {/* Notepad Component */}
      <div class='component-section'>
        <h2 class='component-title'>Notepad Component</h2>
        <Window 
          title='Notepad - XP Style'
          statusBar={
            <StatusBar>
              <StatusField>Lines: {notepadValue().split('\n').length}</StatusField>
              <StatusField>Characters: {notepadValue().length}</StatusField>
              <StatusField>Line Numbers: {showLineNumbers() ? 'On' : 'Off'}</StatusField>
            </StatusBar>
          }
        >
          <div style='display: flex; gap: 10px; margin-bottom: 10px; padding: 5px; border-bottom: 1px solid #c0c0c0;'>
            <Button 
              size='small'
              onClick={() => setShowLineNumbers(!showLineNumbers())}
            >
              {showLineNumbers() ? 'Hide' : 'Show'} Line Numbers
            </Button>
            <Button 
              size='small'
              onClick={() => setNotepadValue('')}
            >
              Clear
            </Button>
            <Button 
              size='small'
              onClick={() => {
                console.log('Notepad content saved:', notepadValue());
                alert('Content saved! Check console for details.');
              }}
            >
              Save (Ctrl+S)
            </Button>
          </div>
          <Notepad
            value={notepadValue()}
            showLineNumbers={showLineNumbers()}
            height='300px'
            onChange={setNotepadValue}
            onSave={(content) => {
              console.log('Saved via Ctrl+S:', content);
              alert('Saved via Ctrl+S! Check console for details.');
            }}
          />
        </Window>
      </div>

      {/* ImageViewer Component */}
      <div class='component-section'>
        <h2 class='component-title'>Image Viewer Component</h2>
        <Window 
          title='Image Viewer - XP Style Gallery'
          statusBar={
            <StatusBar>
              <StatusField>Image: {currentImageIndex() + 1} of {sampleImages.length}</StatusField>
              <StatusField>Gallery View</StatusField>
              <StatusField>Use ← → arrows or click thumbnails</StatusField>
            </StatusBar>
          }
        >
          <div style='margin-bottom: 10px;'>
            <p style='font-size: 11px; color: #666; margin: 5px 0;'>
              Use keyboard arrows (← →), click navigation buttons, or click thumbnails. 
              Press Space to toggle slideshow, Escape to close (if close handler is set).
            </p>
          </div>
          <ImageViewer
            images={sampleImages}
            currentIndex={currentImageIndex()}
            height='400px'
            showThumbnails={true}
            showControls={true}
            autoPlayInterval={4000}
            fit='contain'
            onImageChange={(index, src) => {
              console.log('Image changed to:', index, src);
              setCurrentImageIndex(index);
            }}
          />
        </Window>
      </div>

      {/* Multiple ImageViewers Demo */}
      <div class='component-section'>
        <h2 class='component-title'>Image Viewer - Multiple Configurations</h2>
        <div style='display: grid; grid-template-columns: 1fr 1fr; gap: 20px;'>
          <Window
            title='Compact Viewer'
            statusBar={
              <StatusBar>
                <StatusField>Compact: No thumbnails</StatusField>
              </StatusBar>
            }
          >
            <ImageViewer
              images={sampleImages.slice(0, 3)}
              height='250px'
              showThumbnails={false}
              showControls={true}
              fit='cover'
            />
          </Window>

          <Window
            title='Auto Slideshow'
            statusBar={
              <StatusBar>
                <StatusField>Auto-playing slideshow</StatusField>
              </StatusBar>
            }
          >
            <ImageViewer
              images={sampleImages.slice(2, 5)}
              height='250px'
              showThumbnails={true}
              showControls={true}
              autoPlay={true}
              autoPlayInterval={2500}
              fit='contain'
            />
          </Window>
        </div>
      </div>

      {/* Modal Image Viewer Demo */}
      <div class='component-section'>
        <h2 class='component-title'>Modal Image Viewer - Windows XP Program Style</h2>
        <Window 
          title='Image Viewer Modal Demo'
          statusBar={
            <StatusBar>
              <StatusField>Click thumbnails to open in modal</StatusField>
              <StatusField>Like Windows Picture and Fax Viewer</StatusField>
            </StatusBar>
          }
        >
          <div style='margin-bottom: 10px;'>
            <p style='font-size: 11px; color: #666; margin: 5px 0;'>
              Click any thumbnail below to open it in a modal viewer, just like the Windows XP Picture and Fax Viewer program.
              Use Escape to close, or click outside the image.
            </p>
          </div>
          
          {/* Thumbnail grid */}
          <div style='display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; padding: 10px; background: white; border: 1px inset #ece9d8;'>
            {sampleImages.map((image, index) => (
              <div 
                style='border: 1px solid #c0c0c0; padding: 4px; background: white; cursor: pointer; text-align: center;'
                onClick={() => {
                  setModalImageIndex(index);
                  setShowModalViewer(true);
                }}
                title={`Open image ${index + 1} in viewer`}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`}
                  style='width: 100%; height: 80px; object-fit: cover; display: block;'
                />
                <div style='font-size: 10px; margin-top: 4px; color: #666;'>
                  Image {index + 1}
                </div>
              </div>
            ))}
          </div>

          <div style='margin-top: 10px; display: flex; gap: 10px;'>
            <Button 
              onClick={() => {
                setModalImageIndex(0);
                setShowModalViewer(true);
              }}
            >
              Open First Image
            </Button>
            <Button 
              onClick={() => {
                setModalImageIndex(Math.floor(Math.random() * sampleImages.length));
                setShowModalViewer(true);
              }}
            >
              Open Random Image
            </Button>
          </div>
        </Window>
      </div>

      {/* Modal ImageViewer */}
      <Show when={showModalViewer()}>
        <ImageViewer
          images={sampleImages}
          currentIndex={modalImageIndex()}
          modal={true}
          modalTitle={`Image Viewer - ${modalImageIndex() + 1} of ${sampleImages.length}`}
          modalCentered={true}
          modalOverlay={true}
          modalEscapeToClose={true}
          showThumbnails={true}
          showControls={true}
          onImageChange={(index, src) => {
            console.log('Modal image changed to:', index, src);
            setModalImageIndex(index);
          }}
          onClose={() => {
            console.log('Modal closed');
            setShowModalViewer(false);
          }}
        />
      </Show>
    </div>
  );
}

render(() => <App />, document.getElementById('root')!);
