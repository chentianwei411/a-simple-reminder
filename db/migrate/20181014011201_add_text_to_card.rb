class AddTextToCard < ActiveRecord::Migration[5.2]
  def change
    add_column :cards, :text, :string
  end
end
