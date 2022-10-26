/**
 * (Currently unused.)
 * Modifies a fixed height TextNode to contain as much placeholder text as can fit within its current height
 * @param node a TextNode. Precondition: must have a textAutoResize value of "NONE" (fixed height)
 */
 function addJustEnoughText(node: TextNode, text: string) {
    if (node.textAutoResize !== "NONE") throw new Error(`Error: node ${node.name} doesn't have a textAutoResize value of "NONE".`)
  
    // Save height value and temporarily set auto resize value to "Auto height"
    const { height } = node
    node.textAutoResize = "HEIGHT"
    node.characters = ""
  
    // Add placeholder text word by word until all text is added, or text height exceeds original height
    const placeholderTextWords = text.split(" ")
    let currentWord = 0
    while (currentWord < placeholderTextWords.length) {
      // Check if the height of the textbox exceeds the original height
      if (node.height <= height) {
        node.insertCharacters(node.characters.length, placeholderTextWords[currentWord] + " ", "AFTER")
      } else {
        node.deleteCharacters(node.characters.length - placeholderTextWords[currentWord - 1].length - 2, node.characters.length)    // Remove last word
        break
      }
      currentWord++
    }
  
    // Restore text box dimensions
    node.resize(node.width, height)
    node.textAutoResize = "NONE"
  }
  
  /**
   * (Currently unused.)
   * Adds placeholder text to `node`, then changes `node`'s auto-resize value to "truncate"
   * @param node a TextNode with textAutoResize value of "NONE" (fixed height)
   */
  function addTextThenTruncate(node: TextNode, text: string) {
    node.characters = text
    node.textAutoResize = "TRUNCATE"
  }