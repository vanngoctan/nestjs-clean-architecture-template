---
sh: >
  echo "Revoking <%= pascalCase %> feature..."
  
  # Delete all generated files
  <% filesToDelete.forEach(function(file) { -%>
  if [ -f "<%= file %>" ]; then
    rm "<%= file %>"
    echo "Deleted: <%= file %>"
  else
    echo "Not found: <%= file %>"
  fi
  <% }) -%>
  
  # Clean up empty directories
  <% dirsToCheck.forEach(function(dir) { -%>
  if [ -d "<%= dir %>" ]; then
    # Check if directory is empty
    if [ -z "$(ls -A '<%= dir %>')" ]; then
      rmdir "<%= dir %>"
      echo "Removed empty directory: <%= dir %>"
    fi
  fi
  <% }) -%>
  
  echo "Revoke operation complete for <%= pascalCase %> feature."
---
