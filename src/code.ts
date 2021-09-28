const placeholderText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

// Applies a default set of text styles to node.
function setDefaultTextStyles(node: TextNode, text: string) {
  node.characters = text
  node.resize(250, 285)
  node.textAutoResize = "HEIGHT"
  node.fontName = { family: 'Roboto', style: 'Regular' }
  node.fontSize = 16
}

function main() {
  // Get the currently selected node, or if multiple nodes are selected, the first node.
  // NOTE: the order of nodes in the selection is *unspecified*.
  // In this context, selection[0] could potentially be any of the selected nodes.
  // See: https://www.figma.com/plugin-docs/api/properties/PageNode-selection/
  const currentSelection = figma.currentPage.selection[0]

  if (!currentSelection) {    // If nothing is selected, create a new textbox with placeholder text.
    Promise.resolve(
      // Load the font.
      figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
    )
      .then(() => {
        // Create the text box.
        const node = figma.createText()

        // Position the text in the center of the viewport.
        node.x = figma.viewport.center.x
        node.y = figma.viewport.center.y

        // Customize the appearance of the text box.
        setDefaultTextStyles(node, placeholderText)

        // Shift focus to the newly created text box.
        figma.currentPage.selection = [node]
      })
      .then(() => {
        figma.closePlugin()
      })
  } else if (currentSelection.type === 'TEXT') {    // If a textbox is selected, replaces its content with placeholder text
    // Check if all fonts are loaded.
    if (!currentSelection.hasMissingFont) {
      // Load all fonts in the textbox.
      Promise.all(
        // If there's more than one font, load all of them.
        currentSelection.fontName === figma.mixed
         ? currentSelection.getRangeAllFontNames(0, currentSelection.characters.length).map(font => figma.loadFontAsync(font))
         : [figma.loadFontAsync(currentSelection.fontName)]
      )
      // TODO: if font loading fails, catch error and set default styles to textbox
        .then(() => {
          // Replace the text content.
          currentSelection.characters = placeholderText
        })
        .catch(error => {   // Throw an error if any of the textbox's fonts are missing.
          console.error(error)
          throw new Error(`Error: Could not load fonts`)
        })
        .then(() => {
          figma.closePlugin()
        })
    }
  } else {    // If any other element is selected, create a new textbox above that element.
    Promise.resolve(
      // Load the font.
      figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
    )
      .then(() => {
        const node = figma.createText()

        // Add text box as a sibling of the selection.
        currentSelection.parent.appendChild(node)

        // Position text box directly atop selection.
        node.x = currentSelection.x
        node.y = currentSelection.y

        // Customize the appearance of the text box.
        setDefaultTextStyles(node, placeholderText)

        // Shift focus to the newly created text box.
        figma.currentPage.selection = [node]
      })
      .then(() => {
        figma.closePlugin()
      })
  }
}

main()