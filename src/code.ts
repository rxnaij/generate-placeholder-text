const placeholderText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

// Get the currently selected element
const currentSelection = figma.currentPage.selection[0]

// If nothing is selected, a new textbox with placeholder text is created
if (!currentSelection) {
  Promise.resolve(
    // Load the font.
    figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
  ).then(() => {
    // Create the text box
    const node = figma.createText()

    // Customize the appearance of the text box
    node.characters = placeholderText
    node.resize(250, 285)
    node.textAutoResize = "HEIGHT"
    node.fontName = { family: 'Roboto', style: 'Regular' }
    node.fontSize = 16
    node.x = figma.viewport.center.x
    node.y = figma.viewport.center.y

    // Shift focus to the newly created text box.
    figma.currentPage.selection = [node]
  })
} else if (currentSelection.type === 'TEXT') {    // If a textbox is selected, replaces its content with placeholder text
  // Check if all fonts are loaded
  if (!currentSelection.hasMissingFont) {
    const fonts = currentSelection.getRangeAllFontNames(0, currentSelection.characters.length)
    
    // Load all fonts in the textbox.
    Promise.all(fonts.map(font => figma.loadFontAsync(font)))
      .then(() => {
        // Replace the text content
        currentSelection.characters = placeholderText
      })
      .catch(error => {   // Throw an error if any of the textbox's fonts are missing
        console.error(error)
        throw new Error(`Error: Could not load fonts`)
      })
  }
  // TODO: what happens if there's a missing font?
} else {    // If any other element is selected, create a new textbox above that element
  Promise.resolve(
    // Load the font.
    figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
  ).then(() => {
    const node = figma.createText()

    // Add text box as a sibling of the selection.
    currentSelection.parent.appendChild(node)
    
    // Position text box directly atop selection.
    node.x = currentSelection.x
    node.y = currentSelection.y

    // Customize the appearance of the text box.
    node.characters = placeholderText
    node.resize(250, 285)
    node.textAutoResize = "HEIGHT"
    node.fontName = { family: 'Roboto', style: 'Regular' }
    node.fontSize = 16

    // Shift focus to the newly created text box.
    figma.currentPage.selection = [node]
    
  })
}

// Edge case: what happens if multiple layers are selected?

// Close plugin
figma.closePlugin();
