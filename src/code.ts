const placeholderText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`


const currentSelection = figma.currentPage.selection[0]

if (!currentSelection) {
  Promise.resolve(
    figma.loadFontAsync({ family: 'Roboto', style: 'Regular' }),
  ).then(() => {
    const node = figma.createText()

    node.resize(250, 285)
    node.textAutoResize = "HEIGHT"
    node.fontName = { family: 'Roboto', style: 'Regular' }
    node.fontSize = 16
    node.characters = placeholderText
    node.x = figma.viewport.center.x
    node.y = figma.viewport.center.y
  })
} else if (currentSelection.type === 'TEXT') {
  // Check if all fonts are loaded first
  if (!currentSelection.hasMissingFont) {
    const fonts = currentSelection.getRangeAllFontNames(0, currentSelection.characters.length)
    Promise.all(fonts.map(font => figma.loadFontAsync(font)))
      .then(() => {
        currentSelection.characters = placeholderText
      })
      .catch(error => {
        console.error(error)
        throw new Error(`Error: Could not load fonts`)
      })
  }
}

// Edge case: what happens if multiple layers are selected?

// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();